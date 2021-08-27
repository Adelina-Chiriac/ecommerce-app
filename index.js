const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");
const { comparePasswords } = require("./repositories/users");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ["dgjrtp4ip24uyro4f3e2"]
}));

// SIGN UP
app.get("/signup", (req, res) => {
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

// SIGN UP
app.post("/signup", async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    const existingUser = await usersRepo.getOneBy({ email: email });
    if (existingUser) {
        return res.send("This email is already in use!");
    }

    if (password !== passwordConfirmation) {
        return res.send("The passwords have to match!");
    }

    // Create a user in our user repository
    const user = await usersRepo.create({ email: email, password: password });

    // Get the ID from the user and store it in the cookie
    req.session.userId = user.id;

    res.send("Your account has been created!");
});

// SIGN OUT
app.get("/signout", (req, res) => {
    req.session = null;
    res.send("You have been logged out!");
});

// SIGN IN
app.get("/signin", (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="Email" />
                <input name="password" placeholder="Password" />
                <button>Sign In</button>
            </form>
        </div>
    `);
});

// SIGN IN
app.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email: email });

    if (!user) {
        return res.send("There is no user with that email!");
    }

    const validPass = await usersRepo.comparePasswords(user.password, password);

    if (!validPass) {
        return res.send("The password is incorrect!");
    }

    // Mark the user as signed in by assigning the ID to the cookie session object
    req.session.userId = user.id;

    res.send("You are now logged in!");
});

app.listen("3000", () => {
    console.log("Listening...");
});