const { check } = require("express-validator");
const usersRepo = require("../../repositories");

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
        })
};