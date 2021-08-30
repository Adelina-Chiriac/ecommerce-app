const layout = require("../layout");

const getError = (errors, prop) => {
    try {
        return errors.mapped()[prop].msg;
    }
    catch (err) {
        return "";
    }
};

module.exports = ({ req, errors }) => {
    return layout({ content: `
        <div>
            <form method="POST">
                <input name="email" placeholder="Email" />
                ${getError(errors, "email")}
                <input name="password" placeholder="Password" />
                ${getError(errors, "password")}
                <input name="passwordConfirmation" placeholder="Password Confirmation" />
                ${getError(errors, "passwordConfirmation")}
                <button>Sign Up</button>
            </form>
        </div>
    `
    });
};