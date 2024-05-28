import { ObjectId } from 'mongodb';
import {NextApiRequest, NextApiResponse} from 'next';
import { verifyToken } from '../../lib/jsonwebtoken';
import {createOrder, Order} from '../../lib/models/Order'; 
import { editProduct, getProduct, Product } from '../../lib/models/Product';
import { Address, getUserByEmailComplety } from '../../lib/models/User';
import product from './product';

export default async function order(req: NextApiRequest, res: NextApiResponse) {
    let response = null;
    let parsedResponse;
    
    if (req.method === 'POST') {
        let parsedBody = JSON.parse(req.body);
        const token = parsedBody.token;

        try {
            response = verifyToken(token);
        
            if (!response) {
                return res.status(401).json({ error: 'Invalid or missing token' });
              }

            if (response != null) {
                if (typeof response === 'string') {
                    parsedResponse = JSON.parse(response);
                } else {
                    parsedResponse = response;
                }
            }

            const user = await getUserByEmailComplety(parsedResponse.email);
            
            if(user) {
                const cartItems = user.cart;
                let totalPrice = 0;
                
                for(const id of cartItems) {
                    const produto = await getProduct(id);
                    if (produto){
                        if(produto.quantity > 0) {
                            const newProduct: Product = {
                                name: produto.name, 
                                description: produto.description,
                                price: produto.price,
                                category: produto.category,
                                brand: produto.brand,
                                quantity: produto.quantity - 1,
                                photo: produto.photo,
                            }
                            totalPrice += produto.price
                            await editProduct(produto._id.toString(), newProduct)
                        } else {
                            return res.status(500).json({ error: 'Internal Server Error' })
                        }
                    }
                }

                const newOrder: Order = {
                    idUser: user._id,
                    idPayment: new ObjectId(34534534534),
                    requestDate: 34534534,
                    productList: cartItems, 
                    value: totalPrice,
                    status: 'status',
                };
                
                const createOrderResult = await createOrder(newOrder);

                if (createOrderResult.acknowledged) {
                    return res.status(201).json({ message: 'Order created successfully' });
                } else {
                   return res.status(500).json({ error: 'Failed to create order' });
                }

            } else {
                return res.status(500).json({ error: 'Internal Server Error' })
            }

        } catch (error) {
            return res.status(400).json({ error: 'Internal Server Error'});
        }

    } 
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}