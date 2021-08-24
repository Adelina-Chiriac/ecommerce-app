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
}