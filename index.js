const express = require("express");
const bodyParser = require("body-parser");
const usersRepo = require("./repositories/users");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="Email" />
            <input name="password" placeholder="Password" />
            <input name="passwordConfirmation" placeholder="Password Confirmation" />
            <button>Sign Up</button>
        </form>
    </div>
    `);
});

app.post("/", async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    const existingUser = await usersRepo.getOneBy({ email: email });
    if (existingUser) {
        return res.send("This email is already in use!");
    }

    if (password !== passwordConfirmation) {
        return res.send("The passwords have to match!");
    }
    res.send("Your account has been created!");
});

app.listen("3000", () => {
    console.log("Listening...");
});