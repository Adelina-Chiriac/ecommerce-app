const express = require("express");
const { validationResult } = require("express-validator");
const multer = require("multer");

const productsRepo = require("../../repositories/products");
const newProductTemplate = require("../../views/admin/products/new");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", (req, res) => {

});

router.get("/admin/products/new", (req, res) => {
    res.send(newProductTemplate({}));
});

router.post("/admin/products/new", upload.single("image"), [requireTitle, requirePrice], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.send(newProductTemplate({ errors }));
    }

    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    
    await productsRepo.create({ title, price, image });

    res.send("Form submitted!");

});

module.exports = router;