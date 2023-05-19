import { Request, Response } from "express"
import prisma from "../../lib/prisma-client"

export const ProductController = {
    getAll: async (req: Request, res: Response) => {
        const limit = Number(req.query.limit) || 20;
        const page = Number(req.query.page) || 1;

        try {
            const products = await prisma.product.findMany(
                {
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                    where: {
                        name: {
                            contains: req.query.search as string || ''
                        },
                        description: {
                            contains: req.query.search as string || ''
                        }
                    }
                }
            );
            return res.status(200).json({ status: 'success', data: products });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    },
    getOne: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const product = await prisma.product.findUnique({ where: { id } });
            if (!product) return res.status(404).json({ message: 'Product not found' });

            return res.status(200).json({ status: 'success', data: product });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }
}