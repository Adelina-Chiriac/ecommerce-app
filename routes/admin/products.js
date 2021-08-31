const express = require("express");
const { validationResult } = require("express-validator");
const productsRepo = require("../../repositories/products");
const newProductTemplate = require("../../views/admin/products/new");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();

router.get("/admin/products", (req, res) => {

});

router.get("/admin/products/new", (req, res) => {
    res.send(newProductTemplate({}));
});

router.post("/admin/products/new", [requireTitle, requirePrice], (req, res) => {
    const errors = validationResult(req);
    console.log(errors);

    res.send("Form submitted!");

});

module.exports = router;