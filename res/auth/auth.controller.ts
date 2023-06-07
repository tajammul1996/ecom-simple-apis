import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express"
import prisma from "../../lib/prisma-client"
import { comparePassword, hashPassword, createJWT } from '../../lib/auth';

type User = {
    id: number;
    email: string;
}

interface RequestWithUser extends Request {
    user?: any;
}



export const AuthController = {
    protect: async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const bearer = req.headers.authorization;

        if (!bearer || !bearer.startsWith('Bearer ')) {

            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = bearer.split('Bearer ')[1].trim();
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        try {
            //@ts-ignore
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload;
            next();
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Unauthorized' });
        }
    },

    login: async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const valid = await comparePassword(password, user.password);
        if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

        const token = createJWT(user);

        return res.status(200).json({ token, status: 'success', message: 'Logged in' });
    },

    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password, name } = req.body;
            if (!email || !password || !name) return res.status(400).json({ message: 'Missing credentials (name, email, password)' });

            const user = await prisma.user.findUnique({ where: { email } });
            if (user) return res.status(400).json({ message: 'User already exists' });

            const hashedPassword = await hashPassword(password);
            const newUser = await prisma.user.create({ data: { email, password: hashedPassword, name } });

            // @ts-ignore
            await prisma.cart.create({
                data: {
                    userId: newUser.id
                }
            })

            const token = createJWT(newUser);
            return res.status(200).json({ token, status: 'success', message: 'Logged in' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }

    },
    logout: async (req: Request, res: Response) => {
        return res.status(200).json({ status: 'success', message: 'Logged out' });
    },

    me: async (req: RequestWithUser, res: Response) => {
        try {
            const email = req.user.email;
            const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true, name: true, avatar: true } });
            if (!user) return res.status(404).json({ message: 'User not found' });

            return res.status(200).json({ status: 'success', data: user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }

    }
}
