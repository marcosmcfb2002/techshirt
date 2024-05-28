import { NextApiRequest, NextApiResponse } from "next";
import { addToWishlist } from "../../lib/models/User";
import { verifyToken } from "../../lib/jsonwebtoken";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(405).send({ message: "Somente método POST é permitido" });
        return;
    }

    const { token, productId } = req.body;

    if (!token || !productId) {
        res.status(400).send({ message: "Token e productId são necessários" });
        return;
    }

    let userEmail;
    try {
        const decoded = verifyToken(token)
        userEmail = decoded.email;
    } catch (err) {
        res.status(403).send({ message: "Token inválido" });
        return;
    }

    const result = await addToWishlist(userEmail, productId)

    if (result.modifiedCount === 0) {
        res
            .status(404)
            .send({ message: "Produto não encontrado na lista de desejos" });
        return;
    }

    res.status(200).send({ message: "Produto removido da lista de desejos" });
}
