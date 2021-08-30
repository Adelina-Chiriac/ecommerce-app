const express = require("express");
const { check, validationResult } = require("express-validator");
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const { requireEmail, requirePassword, requirePasswordConfirmation } = require("./validators");

const router = express.Router();

// SIGN UP
router.get("/signup", (req, res) => {
    res.send(signupTemplate({ req: req }));
});

// SIGN UP
router.post(
    "/signup", 
[
    requireEmail,
    requirePassword,
    requirePasswordConfirmation
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.send(signupTemplate({ req, errors }));
    }
    
    const { email, password, passwordConfirmation } = req.body;

    // Create a user in our user repository
    const user = await usersRepo.create({ email: email, password: password });

    // Get the ID from the user and store it in the cookie
    req.session.userId = user.id;

    res.send("Your account has been created!");
});

// SIGN OUT
router.get("/signout", (req, res) => {
    req.session = null;
    res.send("You have been logged out!");
});

// SIGN IN
router.get("/signin", (req, res) => {
    res.send(signinTemplate());
});

// SIGN IN
router.post("/signin", async (req, res) => {
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

module.exports = router;