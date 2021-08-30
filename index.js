const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authenticationRouter = require("./routes/admin/auth");

const { comparePasswords } = require("./repositories/users");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ["dgjrtp4ip24uyro4f3e2"]
}));
app.use(authenticationRouter);

app.listen("3000", () => {
    console.log("Listening...");
});