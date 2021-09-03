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

router.get("/admin/products/:id/edit", requireAuthentication, async (req, res) => {
    const product = await productsRepo.getOne(req.params.id);

    if (!product) {
        return res.send("Product not found!");
    }

    res.send(editProductTemplate({ product }));
});

router.post("/admin/products/:id/edit", 
    requireAuthentication, 
    upload.single("image"), 
    [requireTitle, requirePrice], 
    handleErrors(editProductTemplate), 
    async (req, res) => {
        const changes = req.body;

        // If a file has been added in the edit form
        if (req.file) {
            changes.image = req.file.buffer.toString("base64");
        }
        try {
            await productsRepo.update(req.params.id, changes);
        }
        catch (err) {
            return res.send("This product could not be found!");
        }

        res.redirect("/admin/products");
}); 

module.exports = router;