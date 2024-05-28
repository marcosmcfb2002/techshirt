import {NextApiRequest, NextApiResponse} from 'next';
import {MongoClient, Db} from 'mongodb';
import bcrypt from 'bcrypt';
import clientPromise from '../../lib/mongodb';
import {signToken} from "../../lib/jsonwebtoken";
import {getUserByEmailComplety} from '../../lib/models/User';
import { getAllProducts } from '../../lib/models/Product';

export default async function products(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const page = Number(req.body);
    
    const products = await getAllProducts(page)

    if (products.length !== 0) {
        return res.status(200).json(products)
    } else if (products .length === 0) {
        return res.status(404).end("not found")
    }

    return res.status(405).end("internal error")
}