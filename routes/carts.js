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

    res.send("Product added to cart!");
});

module.exports = router;