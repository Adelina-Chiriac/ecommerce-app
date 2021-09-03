const { validationResult } = require("express-validator");
const users = require("../../repositories/users");

module.exports = {
    handleErrors(templateFunction, dataCallback) {
        return async (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                let data = {};
                if (dataCallback) {
                    data = await dataCallback(req);
                }

                return res.send(templateFunction({ errors, ...data }));
            }

            next();
        }
    },
    requireAuthentication(req, res, next) {
        if (!req.session.userId) {
            return res.redirect("/signin");
        }

        next();
    }
};