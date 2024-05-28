import {NextApiRequest, NextApiResponse} from 'next';
import { verifyToken } from '../../lib/jsonwebtoken';
import { getUserByEmailComplety, updateUser, User } from '../../lib/models/User';
import { getProduct } from '../../lib/models/Product';

export default async function addProductInCart(req: NextApiRequest, res: NextApiResponse) {
    let parsedBody;
    
    if(req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const request = JSON.parse(req.body);
    const response = verifyToken(request.token);
    console.log(response)

    if(response != null){
        const dbUser = await getUserByEmailComplety(response["email"]);
        const product = await getProduct(request.id)

    if (dbUser != null && request.id && product != null){
        let cart : string[] = [];
        
        if (dbUser.cart == null){
            cart.push(request.id)
        } else if (dbUser != null){
            cart = dbUser.cart
            cart.push(request.id)
        }

        const user : User = {
            _id: dbUser._id,
            name: dbUser.name,
            lastName: dbUser.lastName,
            email: dbUser.email,
            password: dbUser.password,
            cpf: dbUser.cpf,
            phone: dbUser.phone,
            address: dbUser.address,
            cart: cart
        }

    const result = await updateUser(user);

    return res.status(200).json({ message: 'Product register In Cart successfully' });
        } else {
            return res.status(405).json({ message: 'Internal Error' });
        }
    } else {
        return res.status(405).json({ message: 'Internal Error' });
}
} 