import nodemailer from 'nodemailer';
import {getUser, getUserByEmailComplety, saveResetPasswordToken} from "../../lib/models/User";
import {signToken} from "../../lib/jsonwebtoken";
import {NextApiRequest, NextApiResponse} from "next";

async function sendRecoveryEmail(_id: Object, email:string) {

    const token = signToken({ _id: _id })

    await saveResetPasswordToken(_id, token);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Recuperação de senha',
        text: `Você solicitou a redefinição de sua senha. Por favor, acesse o seguinte link para redefinir sua senha: ${process.env.CLIENT_URL}/user/resetPassword/${token}`
    };

    await transporter.sendMail(mailOptions);
}

export default async function resetPasswordRequest(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email } = req.body;

        const user = await getUserByEmailComplety(email);

        if (user) {
            await sendRecoveryEmail(user._id, user.email);
            res.status(200).json({ message: 'Email de recuperação enviado.' });
        } else {
            res.status(400).json({ error: 'Email não encontrado.' });
        }
    } else {
        res.status(405).json({ error: 'Método não permitido.' });
    }
}