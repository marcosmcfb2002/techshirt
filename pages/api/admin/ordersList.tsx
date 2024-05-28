import {NextApiRequest, NextApiResponse} from 'next';
import { verifyToken } from '../../../lib/jsonwebtoken';
import { getUserByEmailComplety } from '../../../lib/models/User';
import { getAllOrder } from '../../../lib/models/Order';

export default async function orderList(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const request = req.body;

    const response = verifyToken(request.token);
    const user = await getUserByEmailComplety(response.email);


    if(user){
        if(user.type == 'admin'){
            if(response != null){
               const listOrders = await getAllOrder(Number(request.page));
               if(listOrders != null){
                 return res.status(200).json(listOrders);
                }
            }
        }
    }
    return res.status(405).end({error: "internal error"});
}