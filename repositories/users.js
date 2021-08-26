const fs = require("fs");
const crypto = require("crypto");

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
        // Retrieve the existing users from our repository
        const records = await this.getAll();
        // Push the new user into the records array
        records.push(attributes);
        // Write the updated records array back to this.filename (users.json, in this case)
        await this.writeAll(records);
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
}

const testFunc = async () => {
    const repo = new UsersRepository("users.json");

    await repo.update("4c2e1609", { password: "mypassword" });

}

testFunc();
