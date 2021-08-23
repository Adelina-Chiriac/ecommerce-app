const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="Email" />
            <input name="password" placeholder="Password" />
            <input name="passwordConfirmation" placeholder="Password Confirmation" />
            <button>Sign Up</button>s
        </form>
    </div>
    `);
});

app.listen("3000", () => {
    console.log("Listening...");
});