const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authenticationRouter = require("./routes/admin/auth");
const adminProductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

const { comparePasswords } = require("./repositories/users");
const carts = require("./repositories/carts");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ["dgjrtp4ip24uyro4f3e2"]
}));
app.use(authenticationRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

app.listen("3000", () => {
    console.log("Listening...");
});