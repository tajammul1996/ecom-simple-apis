import { Request, Response } from "express"
import prisma from "../../lib/prisma-client"


export const OrderController = {
    getAll: async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const orders = await prisma.order.findMany({
                where: {
                    userId
                }, 
                include: {
                    OrderItem: true
                }
            })
            return res.status(200).json({
                message: "orders retrieved.",
                data: orders
            })

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "something went wrong" })
        }

    },
    getOne: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const order = await prisma.order.findUnique({
                where: {
                    id
                },
                include: {
                    OrderItem: {
                        include: {
                            product: true
                        }
                    }
                }
            })
            return res.status(200).json({
                message: "order retrieved.",
                data: order
            })

        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "something went wrong" })
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const { items } = req.body;

            if (!items || items.length === 0) {
                return res.status(400).json({ message: "order items are empty." })
            }

            const total = items.reduce((acc: number, item: any) => {
                return acc + item.price * item.quantity
            }, 0)
            const order = await prisma.order.create({
                data: {
                    userId,
                    total,
                    OrderItem: {
                        createMany: {
                            data: req.body.items.map((item: any) => {
                                return {
                                    quantity: item.quantity,
                                    total: item.price * item.quantity,
                                    productId: item.productId
                                }
                            })
                        }
                    }
                }
            })

            return res.status(200).json({
                message: "order created.",
                data: order
            })
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "something went wrong" })
        }
    },
    update: async (req: Request, res: Response) => { },
}