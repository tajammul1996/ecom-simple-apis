import prisma from "../../lib/prisma-client";
import data from "./flipkart";


const getJsonParsed = (data: any) => {
    try {
        return JSON.parse(data);
    } catch (error) {
        return data;
    }
};


const seed = async () => {
    try {
        const productsToCreate = [];
        let dataSlice = data.slice(0, 100);
        console.log(JSON.parse(data[0].image))
        for (let i = 0; i < data.length; i++) {
            const product = data[i];
            productsToCreate.push({
                name: product.product_name,
                price: parseFloat(product.retail_price || '0'),
                images: getJsonParsed(product.image),
                description: product.description,
            });
        }

        await prisma.product.createMany({
            data: productsToCreate,
            skipDuplicates: true
        });

    } catch (error) {
        console.log(error);
    }
};

seed();