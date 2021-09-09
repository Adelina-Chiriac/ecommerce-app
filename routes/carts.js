const express = require("express");
const cartsRepo = require("../repositories/carts");

const router = express.Router();

router.post("/cart/products", async (req, res) => {
    let cart;
    // If the user doesn't have an existing cart
    if (!req.session.cartId) {
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    }
    // If the user has an existing cart
    else {
        cart = await cartsRepo.getOne(req.session.cartId);
    }
    
    // If the product already exists in the user's cart...
    const existingProduct = cart.items.find((item) => item.id === req.body.productId);
    // ...increase the quantity
    if (existingProduct) {
        existingProduct.quantity++;
    }
    // If the product does not exist in the user's cart already, add it
    else {
        cart.items.push({ id: req.body.productId, quantity: 1});
    }


    res.send("Product added to cart!");
});

module.exports = router;