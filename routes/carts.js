const express = require("express");
const cartsRepo = require("../repositories/carts");
const productsRepo = require("../repositories/products");
const showCartTemplate = require("../views/carts/show");

const router = express.Router();

// POST request for adding products to cart
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

    // Save the cart record to the repository
    await cartsRepo.update(cart.id, {
        items: cart.items
    });

    res.send("Product added to cart!");
});

// GET request to show all the products in the cart
router.get("/cart", async (req, res) => {
    // If the user doesn't have an existing cart, redirect to homepage
    if (!req.session.cartId) {
        return res.redirect("/");
    }
    // Fetch the user's cart
    const cart = await cartsRepo.getOne(req.session.cartId);
    // Iterate through the products in the cart & look them up in the products repository
    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id);
        // Add the product info to the item variable for building the cart template
        item.product = product;
    }

    res.send(showCartTemplate({ items: cart.items }));
});

module.exports = router;