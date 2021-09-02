const express = require("express");
const { handleErrors } = require("./middlewares");
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser } = require("./validators");

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
], handleErrors(signupTemplate), async (req, res) => {
    
    const { email, password } = req.body;

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
    res.send(signinTemplate({}));
});

// SIGN IN
router.post("/signin", [
    requireEmailExists,
    requireValidPasswordForUser
], handleErrors(signinTemplate), async (req, res) => {

    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email: email});
    
    // Mark the user as signed in by assigning the ID to the cookie session object
    req.session.userId = user.id;

    res.send("You are now logged in!");
});

module.exports = router;