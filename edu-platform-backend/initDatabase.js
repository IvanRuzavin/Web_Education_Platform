const db = require("./db");

db.serialize(() => {

    db.run(`
    CREATE TABLE IF NOT EXISTS Users(
        uid TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        progress INTEGER NOT NULL,
        experience INTEGER NOT NULL,
        level INTEGER NOT NULL,
        rank TEXT NOT NULL,
        avatar TEXT NOT NULL,
        email TEXT,
        birthplace TEXT,
        phone TEXT,
        is_online INTEGER NOT NULL
    )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS Projects(
        project_id TEXT PRIMARY KEY,
        complexity INTEGER
    )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS UserToProject(
        user_id TEXT,
        project_id TEXT,
        score INTEGER,

        FOREIGN KEY(user_id)
            REFERENCES Users(uid),

        FOREIGN KEY(project_id)
            REFERENCES Projects(project_id)
    )
    `);

});

console.log("Database initialized");