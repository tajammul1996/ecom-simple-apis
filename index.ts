import express from 'express';
import authRouter from './res/auth/auth.routes';
import productRouter from './res/product/product.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter)
app.use("/api/products", productRouter)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});