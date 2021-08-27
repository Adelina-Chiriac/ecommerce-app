const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

// Use a promise-based version of the scrypt function (instead of the original callback)
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
    constructor(filename) {
        // If there was no filename argument provided when creating a new instance of the class
        if (!filename) {
            throw new Error("Creating a repository requires a filename!");
        }

        this.filename = filename;
        try {
            // Check to see if the file already exists
            fs.accessSync(this.filename);
        }
        // The file does not exist yet, which means we need to create it
        catch(err) {
            fs.writeFileSync(this.filename, "[]");
        }
    }

    // Retrieve all the users in the repository
    async getAll() {
        // Open the file, read it and parse it 
        const contents = JSON.parse(await fs.promises.readFile(this.filename, { encoding: "utf8"}));

        // Return the parsed contents
        return contents;
    }

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

    async writeAll(records) {
        // Write the records array to the repository file
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    randomId() {
        // Generate a random ID
        return crypto.randomBytes(4).toString("hex");
    }

    async getOne(id) {
        // Retrieve all the existing records/users
        const records = await this.getAll();
        // Iterate through the users array and search for the given ID (return true if the user with that given ID has been found)
        return records.find((record) => record.id === id );
    }

    async delete(id) {
        // Retrieve all the existing records/users
        const records = await this.getAll();
        // Filter out the user with the given ID from the records array
        const filteredRecords = records.filter((record) => record.id !== id);
        // Write the updated records array to the repository file
        await this.writeAll(filteredRecords);
    }

    async update(id, attributes) {
        // Retrieve all the existing records/users
        const records = await this.getAll();
        // Iterate through the users array and search for the user with the given ID
        const record = records.find((record) => record.id === id );
        // Check if we found a record
        if (!record) {
            throw new Error(`The record with the id ${id} has not been found!`);
        }
        // Update the record (copy all the key value pairs from attributes, one by one, into the record object)
        Object.assign(record, attributes);
        // Write the updated records array to the repository file
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        // Retrieve all the existing records/users
        const records = await this.getAll();
        // Iterate through the records array
        for (let record of records) {
            // Initialize a temporary variable to keep track if the record has been found
            let found = true;
            // Iterate through the filters object
            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }
            // If found is still true, it means we found a match
            if (found) {
                return record;
            }
        }
    }
}

// Make the class available for import by other files
module.exports = new UsersRepository("users.json");