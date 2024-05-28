import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../lib/jsonwebtoken";
import { getAllUsers, getUserByEmailComplety } from "../../../lib/models/User";
import { getAllAssessments} from "../../../lib/models/Product";

export default async function customers(req: NextApiRequest, res: NextApiResponse) {

    if(req.method !== 'POST') {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const response = verifyToken(req.body.token);

    const user = await getUserByEmailComplety(response.email)

    if (user){
    if (user.type == "admin"){
    if(response != null){
        const listProducts = await getAllAssessments(req.body.page);
        if(listProducts != null){
                return res.status(200).json(listProducts)
            } 
        }
    }
}
    return res.status(405).end({error: "internal error"})
}