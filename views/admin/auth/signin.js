const layout = require("../layout");

const getError = (errors, prop) => {
    try {
        return errors.mapped()[prop].msg;
    }
    catch(err) {
        return "";
    }
};

module.exports = ({ errors }) => {
    return layout({ content: `
        <div>
            <form method="POST">
                <input name="email" placeholder="Email" />
                ${getError(errors, "email")}
                <input name="password" placeholder="Password" />
                ${getError(errors, "password")}
                <button>Sign In</button>
            </form>
        </div>
    `
    });
};