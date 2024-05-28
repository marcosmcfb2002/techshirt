import { Db, MongoClient, ObjectId, Sort } from 'mongodb';
import clientPromise from '../../lib/mongodb';


export type Assessment = {
    assessment: string;
    idUser: ObjectId;
    note: number;
}

export type Product = {
    _id?: ObjectId;
    idUser?: ObjectId;
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    quantity: number;
    photo: string[];
    assessments?: Assessment[];
};

const client: MongoClient = await clientPromise;
const db: Db = client.db();

export async function addProduct(product: Product) {
    return await db.collection('products').insertOne(product);
}

export async function deleteProduct(productId: string) {
    return await db.collection('products').deleteOne({ _id: new ObjectId(productId) });
}

export async function editProduct(productId: string, updateProduct: Product) {
    return await db.collection('products').updateOne({ _id: new ObjectId(productId) }, { $set: updateProduct })
}

export async function getProduct(productId: string) {
    return await db.collection('products').findOne({_id: new ObjectId(productId)}, { projection: { idUser: 0 } });
}

export async function getAllProductCategories() {
    return await db.collection('products').aggregate([
        { $group: { _id: "$category" } }
    ]).toArray().then(items => items.map(item => item._id));
}

function quickSort(array: any[], left: number, right: number, priceFilter: string) {
    let index;
    if (array.length > 1) {
        index = partition(array, left, right, priceFilter);
        if (left < index - 1) {
            quickSort(array, left, index - 1, priceFilter);
        }
        if (index < right) {
            quickSort(array, index, right, priceFilter);
        }
    }
    return array;
}

function partition(array: any[], left: number, right: number, priceFilter: string) {
    let pivot = array[Math.floor((right + left) / 2)].price;
    let i = left;
    let j = right;

    while (i <= j) {
        if (priceFilter === 'mostExpensive') {
            while (array[i].price > pivot) {
                i++;
            }
            while (array[j].price < pivot) {
                j--;
            }
        } else if (priceFilter === 'cheapest') {
            while (array[i].price < pivot) {
                i++;
            }
            while (array[j].price > pivot) {
                j--;
            }
        }
        if (i <= j) {
            [array[i], array[j]] = [array[j], array[i]];
            i++;
            j--;
        }
    }
    return i;
}

export async function getAllProducts(page: number, categories?: string, priceFilter?: string, priceRange?: { min: number, max: number }, searchText?: string) {
    const db = client.db();
    await db.collection('products').createIndex({
        name: "text",
        description: "text"
      });
    let query: any = {};
    let productDb;

    if (categories && categories.trim() !== '') {
        query.category = { $in: [categories] };
    }

    if (
        priceRange && typeof priceRange.min === 'number' && !Number.isNaN(priceRange.min) && typeof priceRange.max === 'number' && !Number.isNaN(priceRange.max)) {
        query.price = { $gte: priceRange.min, $lte: priceRange.max };
    }

    if (searchText && searchText.trim() !== '') {
        query.$text = { $search: searchText };
    }

    productDb = await db.collection('products').aggregate([
        { $match: query },
        { $project: { idUser: 0 } },
        { $skip: 9 * page },
        { $limit: 9 }
    ]).toArray();

    if (priceFilter && priceFilter != "defaultOrdering") {
        productDb = await db.collection('products').aggregate([
            { $match: query },
            { $project: { idUser: 0 } },
        ]).toArray();
        productDb = quickSort(productDb, 0, productDb.length - 1, priceFilter);
        productDb = productDb.slice(9 * page, 9 * (page + 1));
    }

    return productDb;
}

export async function getAllAssessments(page: number) {
    const assessmentsDb = await db.collection('products').find({}, { projection: { assessments: 1, _id: 0 } }).skip(9 * page).limit(9).toArray();
    return assessmentsDb;
}

export async function getEveryProducts() {
    const productDb = await db.collection('products').find({}, { projection: { idUser: 0 } }).toArray();
    return productDb;
}

export async function getEveryAssessments() {
    const assessmentsDb = await db.collection('products').find({}, { projection: { assessments: 1, _id: 0 } }).toArray();
    return assessmentsDb;
}

