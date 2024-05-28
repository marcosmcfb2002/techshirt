import { Db, MongoClient, ObjectId } from "mongodb";
import clientPromise from "../mongodb";

export type Order = {
  _id?: ObjectId;
  idUser: ObjectId;
  idPayment: ObjectId;
  requestDate: Number;
  productList: string[];
  value: Number;
  status: string;
};

const client: MongoClient = await clientPromise;
const db: Db = client.db();

export async function createOrder(order: Order) {
  return await db.collection("orders").insertOne(order);
}

export async function getOrder(userId: string): Promise<Order[]> {
  return (await db
    .collection("orders")
    .find(
      { idUser: new ObjectId(userId) },
      { projection: { idUser: 0, idPayment: 0 } }
    )
    .toArray()) as Order[];
}

export async function getAllOrder(page: number) {
  const orderDb = await db
    .collection("orders")
    .find({}, { projection: { idUser: 0 } })
    .skip(8 * page)
    .limit(8)
    .toArray();
  return orderDb;
}

export async function getEveryOrder() {
  const orderDb = await db
    .collection("orders")
    .find({}, { projection: { idUser: 0 } })
    .toArray();
  return orderDb;
}
