import * as functions from "firebase-functions";
import { stripeConfig } from "../../config/index"

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});


const stripe = require('stripe')(stripeConfig.sk);

export const getAllProducts = functions.https.onCall(async (data, context) => {
    const options = data && JSON.parse(data),
        products = (await stripe.products.list({})).data;

    if (options)
        if (options.showPrices)
            for (const product of products)
                product.prices = (await stripe.prices.search({ query: `product:\"${product.id}\"` })).data
    return products
})

export const getProduct = functions.https.onCall(async (data, context) => {
    const options = data && JSON.parse(data),
        product = await stripe.products.retrieve(options.id)

    if (options)
        if (options.showPrices) product.prices = (await stripe.prices.search({ query: `product:\"${product.id}\"` })).data
    return product
})

export const getPrice = functions.https.onCall(async (data, context) => {
    const options = data && JSON.parse(data)
    return (await stripe.prices.search({ query: `product:\"${options.productId}\"` })).data
})