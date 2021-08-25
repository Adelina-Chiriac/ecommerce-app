const fs = require("fs");

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
        // Retrieve the existing users from our repository
        const records = await this.getAll();
        // Push the new user into the records array
        records.push(attributes);
        // Write the updated records array back to this.filename (users.json, in this case)
        await fs.promises.writeFile(this.filename, JSON.stringify(records));
    }
}

const testFunc = async () => {
    const repo = new UsersRepository("users.json");

    await repo.create({ email: "test@gmail.com", password: "pass" });

    const users = await repo.getAll();
    console.log(users);
}

testFunc();
