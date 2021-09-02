const express = require("express");
const multer = require("multer");

const { handlleErrors, handleErrors } = require("./middlewares");
const productsRepo = require("../../repositories/products");
const newProductTemplate = require("../../views/admin/products/new");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", async (req, res) => {
    const products = await productsRepo.getAll();
});

router.get("/admin/products/new", (req, res) => {
    res.send(newProductTemplate({}));
});

router.post("/admin/products/new", upload.single("image"), [requireTitle, requirePrice], handleErrors(newProductTemplate), async (req, res) => {

    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;

    await productsRepo.create({ title, price, image });

    res.send("Form submitted!");
});

module.exports = router;