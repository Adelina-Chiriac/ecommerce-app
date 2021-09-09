const express = require("express");
const cartsRepo = require("../repositories/carts");

const router = express.Router();

router.post("/cart/products", async (req, res) => {
    // If the user doesn't have an existing cart
    if (!req.session.cartId) {
        const cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    }

    res.send("Product added to cart!");
});

module.exports = router;