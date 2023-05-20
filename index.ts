import express from 'express';
import dotenv from 'dotenv';

import authRouter from './res/auth/auth.routes';
import productRouter from './res/product/product.routes';
import orderRouter from './res/orders/orders.routes';

import { AuthController } from './res/auth/auth.controller';

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter)
app.use("/api/products", productRouter)
app.use("/api/orders", AuthController.protect ,orderRouter)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});