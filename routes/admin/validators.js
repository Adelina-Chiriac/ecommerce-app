const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
    requireEmail: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Please enter a valid email address")
        .custom(async (email) => {
            const existingUser = await usersRepo.getOneBy({ email: email });
            if (existingUser) {
                throw new Error("This email address is already in use");
            }
        }),
    requirePassword: check("password")
        .trim()
        .isLength({ min: 8, max: 20})
        .withMessage("Your password must be between 8 and 20 characters long"),
    requirePasswordConfirmation: check("passwordConfirmation")
        .trim()
        .isLength({ min: 8, max: 20})
        .withMessage("Your password must be between 8 and 20 characters long")
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error("Passwords must match");
            }
            return true;
        }),
    requireEmailExists: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Please enter a valid email address")
        .custom(async (email) => {
            const user = await usersRepo.getOneBy({ email: email});
            if (!user) {
                throw new Error("There is no user with that email!");
            }
        }),
    requireValidPasswordForUser: check("password")
        .trim()
        .custom(async (password, { req }) => {
            const user = await usersRepo.getOneBy({ email: req.body.email });
            if (!user) {
                throw new Error("The password is incorrect!");
            }
            const validPass = await usersRepo.comparePasswords(user.password, password);
            if (!validPass) {
                throw new Error("The password is incorrect!");
            }
        })
};