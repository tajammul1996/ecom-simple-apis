import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'

import authRouter from './res/auth/auth.routes';
import productRouter from './res/product/product.routes';
import orderRouter from './res/orders/orders.routes';
import cartRouter from './res/cart/cart.routes';

import { AuthController } from './res/auth/auth.controller';

dotenv.config();

const app = express();

app.use(cors())

app.use(express.json());

app.use("/api/auth", authRouter)
app.use("/api/products", productRouter)
app.use("/api/orders", AuthController.protect, orderRouter)
app.use("/api/cart", AuthController.protect, cartRouter)

app.listen(3005, () => {
    console.log("Server is running on port 3005");
});