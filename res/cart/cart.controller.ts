import { NextFunction, Request, Response } from "express"
import prisma from "../../lib/prisma-client"

export const CartController = {
  getAll: async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const cart = await prisma.cart.findFirst({
        where: {
          userId
        },
      })



      const cartItems = await prisma.cartItem.findMany({
        where: {
          cartId: cart?.id
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
            }
          }
        },
      })



      return res.status(200).json({
        message: "cart retrieved.",
        data: cartItems
      })

    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "something went wrong" })
    }

  },

  addItemToCart: async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const { product } = req.body;
      const cart = await prisma.cart.findFirst({
        where: {
          userId
        }
      })


      const cartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart?.id,
          productId: product.id
        }
      })

      console.log(cartItem);

      if (cartItem) {
        return res.status(200).json({
          message: "item already exists in cart.",
          data: null
        })
      }

      const item = await prisma.cartItem.create({
        data: {
          userId,
          cartId: cart?.id,
          productId: product.id,
          quantity: product.quantity,

        }
      })

      return res.status(200).json({
        message: "item added to cart.",
        data: item
      })



    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "failed to add the item in the cart." })
    }

  },



  deleteOne: async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const { id } = req.params;
      const item = await prisma.cartItem.delete({
        where: {
          id
        }
      })

      return res.status(200).json({
        message: "item deleted.",
        data: item
      })

    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "something went wrong" })
    }
  },

  deleteAll: async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const cart = await prisma.cartItem.deleteMany({
        where: {
          userId
        }
      })

      return res.status(200).json({
        message: "cart cleared successfully.",
        data: []
      })

    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "something went wrong" })
    }
  },

  updateOne: async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const { id } = req.params;
      const { quantity } = req.body;
      const item = await prisma.cartItem.update({
        where: {
          id
        },
        data: {
          quantity
        }
      })

      return res.status(200).json({
        message: "item updated.",
        data: item
      })

    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "something went wrong" })
    }
  }
}