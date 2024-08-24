import {Collection} from "./collectionDatabase";

const sqlite3 = require('sqlite3').verbose();

interface Page {
    id : number,
    name : string ,
    content : string ,
    isDeleted : 0 | 1 ,
    collectionRef : number ,
}

const ErrorType : Record<string, string> = {
    "SQLITE_CONSTRAINT: UNIQUE constraint failed: User.email" : "Email already exists",
    "SQLITE_CONSTRAINT: Page collection does not belong to the same user" : "Page collection id invalid",
}

class PageDatabase {
    private static db: any;

    static {
        this.db = new sqlite3.Database('database.db', async (err: Error | null) => {
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('[ PAGE ] : Connected to the SQLite database.');

                await new Promise(resolve => setTimeout(resolve, 100));

                this.db.run('PRAGMA foreign_keys = ON;', (err:Error) => {
                    if (err) {
                        console.error('Error enabling foreign keys : [ PAGE ] : ', err.message);
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 100));

                this.db.run(`CREATE TABLE IF NOT EXISTS Page (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    content TEXT,
                    isDeleted BOOLEAN DEFAULT FALSE,
                    userRef INTEGER NOT NULL,
                    collectionRef INTEGER NOT NULL,
                    FOREIGN KEY (collectionRef) REFERENCES Collection (id),
                    FOREIGN KEY (userRef) REFERENCES User (id)
                )`, (err: Error | null) => {
                    if (err) {
                        console.error('Error creating table:', err.message);
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 100));

                await new Promise(resolve => setTimeout(resolve, 100));

                this.db.run(`
                            CREATE TRIGGER IF NOT EXISTS check_parent_user_update_page
                            BEFORE UPDATE ON Page
                            FOR EACH ROW
                            BEGIN
                                -- Ensure that if the parent is changed, it still belongs to the same user
                                SELECT
                                CASE
                                    WHEN (NEW.collectionRef IS NOT NULL AND
                                          (SELECT userRef FROM Collection WHERE id = NEW.collectionRef) != NEW.userRef) THEN
                                        RAISE (ABORT, 'Page collection does not belong to the same user')
                                END;
                            END;
                            `, (err:Error) => {

                    if (err) {
                        console.error('Error enabling foreign keys : [ COLLECTION ] : TRIGGER ', err.message);
                    }else{
                        console.log("Created trigger for Page Update")
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 100));

                this.db.run(`
                            CREATE TRIGGER IF NOT EXISTS check_parent_user_insert_page
                            BEFORE INSERT ON Page
                            FOR EACH ROW
                            BEGIN
                                -- Ensure that if a parent is assigned during insertion, it belongs to the same user
                                SELECT
                                CASE
                                    WHEN (NEW.collectionRef IS NOT NULL AND
                                          (SELECT userRef FROM Collection WHERE id = NEW.collectionRef) != NEW.userRef) THEN
                                        RAISE (ABORT, 'Page collection does not belong to the same user')
                                END;
                            END;

                            `, (err:Error) => {

                    if (err) {
                        console.error('Error enabling foreign keys : [ COLLECTION ] : TRIGGER ', err.message);
                    }else{
                        console.log("Created trigger for Page Insert")
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 100));
            }
        });
    }

    static async createPage(name : string,collectionRef:number,userId:number): Promise<Page | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise(async (resolve, reject) => {
            this.db.run('INSERT INTO Page (name,collectionRef,userRef) VALUES (?, ? , ?)', [name,collectionRef,userId], async function (err: Error | null) {
                if (err) {
                    if(err.message in ErrorType){
                        reject(ErrorType[err.message]);
                    }else{
                        reject();
                    }
                } else {
                    // @ts-ignore
                    const lastId = this.lastID;

                    const page = await PageDatabase.findPageById(lastId,userId).catch(()=>null)
                    if(!page) return reject();
                    resolve(page);
                }
            });
        });
    }

    static async moveById(toCollection:number | null,id:number,userId:number): Promise<true | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<true | null>((resolve, reject) => {
            this.db.get('UPDATE Page SET collectionRef = ? WHERE id = ? AND userRef = ?', [toCollection,id,userId], (err: Error | null, row: Collection | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async renameById(pageId : number,userId:number,name:string): Promise<true | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<true | null>((resolve, reject) => {
            this.db.get('UPDATE Page SET name = ? WHERE id = ? AND userRef = ?', [name,pageId,userId], (err: Error | null, row: Collection | undefined) => {
                console.log(name , pageId , userId)
                if (err) {
                    reject(null);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async savePage(pageId : number,content:string,userId:number): Promise<true | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise(async (resolve, reject) => {
            this.db.run('UPDATE Page SET content = ? WHERE id = ? AND userRef = ?', [content,pageId,userId], async function (err: Error | null) {
                if (err) {
                    console.log(err)
                    if(err.message in ErrorType){
                        reject(ErrorType[err.message]);
                    }else{
                        reject();
                    }
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async findPageById(pageId : number , userId : number): Promise<Page | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Page | null>((resolve, reject) => {
            this.db.get('SELECT * FROM Page WHERE id = ? AND userRef = ?', [pageId , userId], (err: Error | null, row: Page | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(row || null);
                }
            });
        });
    }

    static async deleteById(pageId : number , userId : number): Promise<true | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<true | null>((resolve, reject) => {
            this.db.get('DELETE FROM Page WHERE id = ? AND userRef = ?', [pageId , userId], (err: Error | null, row: Page | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async findByCollectionId(collectionId : number , userId : number): Promise<Page[] | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Page[] | null>((resolve, reject) => {
            this.db.all('SELECT * FROM Page WHERE collectionRef = ? AND userRef = ?', [collectionId,userId], (err: Error | null, row: Page[] | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(row || null);
                }
            });
        });
    }

    static async findByName(name : string , userId : number): Promise<Page[] | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Page[] | null>((resolve, reject) => {
            this.db.all(
                'SELECT * FROM Page WHERE name LIKE ? AND userRef = ?',
                [`%${name}%`, userId],
                (err: Error | null, row: Page[] | undefined) => {
                    if (err) {
                        reject(null);
                    } else {
                        resolve(row || null);
                    }
                }
            );
        });
    }
}

export default PageDatabase;
