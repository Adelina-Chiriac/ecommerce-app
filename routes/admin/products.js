const express = require("express");
const multer = require("multer");

const { handleErrors, requireAuthentication } = require("./middlewares");
const productsRepo = require("../../repositories/products");
const newProductTemplate = require("../../views/admin/products/new");
const productsIndexTemplate = require("../../views/admin/products/index");
const editProductTemplate = require("../../views/admin/products/edit");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", requireAuthentication, async (req, res) => {
    const products = await productsRepo.getAll();
    
    res.send(productsIndexTemplate({ products }));
});

router.get("/admin/products/new", requireAuthentication, (req, res) => {
    res.send(newProductTemplate({}));
});

router.post("/admin/products/new", requireAuthentication, upload.single("image"), [requireTitle, requirePrice], handleErrors(newProductTemplate), async (req, res) => {

    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;

    await productsRepo.create({ title, price, image });

    res.redirect("/admin/products");
});

router.get("/admin/products/:id/edit", async (req, res) => {
    const product = await productsRepo.getOne(req.params.id);

    if (!product) {
        return res.send("Product not found!");
    }

    res.send(editProductTemplate({ product }));
});

module.exports = router;