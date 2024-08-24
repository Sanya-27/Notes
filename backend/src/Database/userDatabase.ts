const sqlite3 = require('sqlite3').verbose();

interface User {
    id : number ,
    email : string ,
    name : string ,
}

const ErrorType : Record<string, string> = {
    "SQLITE_CONSTRAINT: UNIQUE constraint failed: User.email" : "EMAIL_ALREADY_EXISTS",
}

class UserDatabase {
    private static db: any;

    static {
        this.db = new sqlite3.Database('database.db', (err: Error | null) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('[ USER ] : Connected to the SQLite database.');

                this.db.run('PRAGMA foreign_keys = ON;', (err:Error) => {
                    if (err) {
                        console.error('Error enabling foreign keys : [ USER ] : ', err.message);
                    }
                });

                this.db.run(`CREATE TABLE IF NOT EXISTS User (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    name TEXT
                )`, (err: Error | null) => {
                    if (err) {
                        console.error('Error creating table:', err.message);
                    }
                });
            }
        });
    }

    static async addUser(email: string, name : string): Promise<boolean | Error> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO User (email, name) VALUES (?, ?)', [email , name], function (err: Error | null) {
                if (err) {
                    if(err.message in ErrorType){
                        reject(ErrorType[err.message]);
                    }else{
                        reject(false);
                    }
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async findUser(email: string): Promise<User | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<User | null>((resolve, reject) => {
            this.db.get('SELECT * FROM User WHERE email = ?', [email], (err: Error | null, row: User | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(row || null);
                }
            });
        });
    }
}

export default UserDatabase;
