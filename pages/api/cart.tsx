import {NextApiRequest, NextApiResponse} from 'next';
import { verifyToken } from '../../lib/jsonwebtoken';
import { getUserByEmailComplety } from '../../lib/models/User';

export default async function addCart(req: NextApiRequest, res: NextApiResponse) {
    let parsedBody;
    
    if(req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const request = req.body;
    const response = verifyToken(request.token);
    
    if (response != null) {
        if (typeof response === 'string') {
            parsedBody = JSON.parse(response);
        } else {
            parsedBody = response;
        }
    }

    if(response != null){

        const dbUser = await getUserByEmailComplety(parsedBody.email);
        
        if (dbUser){
            if (dbUser.cart){
                return res.status(200).json({cart: dbUser.cart})
            } else {
                return res.status(404).end("cart not found")
            }
        }
        return res.status(405).json({ message: 'Internal Error' });
        } else {
            return res.status(405).json({ message: 'Internal Error' });
        }
} 