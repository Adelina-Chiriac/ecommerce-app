const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository");

// Use a promise-based version of the scrypt function (instead of the original callback)
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    async create(attributes) {
        // Assign a randomly generated ID to the attributes object
        attributes.id = this.randomId();
        // Generate a salt
        const salt = crypto.randomBytes(8).toString("hex");
        // Use the password & salt to generate a hashed password
        const hashed = await scrypt(attributes.password, salt, 64);
        // Retrieve the existing users from our repository
        const records = await this.getAll();
        // Push the new user into the records array
        const record = {
            ...attributes, 
            password: `${hashed.toString("hex")}.${salt}`
        }
        records.push(record);
        // Write the updated records array back to this.filename (users.json, in this case)
        await this.writeAll(records);
        // Return the record object
        return record;
    }

    async comparePasswords(savedPass, suppliedPass) {
        // Destructure the hashed password and the salt from our database
        const [hashed, salt] = savedPass.split(".");
        // Hash the password supplied by the user along with the salt
        const hashedSuppliedPass = await scrypt(suppliedPass, salt, 64);
        // Compare the hashed passwords (supplied and saved)
        return (hashedSuppliedPass.toString("hex") === hashed);
    }
}

// Make the class available for import by other files
module.exports = new UsersRepository("users.json");