import Database from "./index";

const sqlite3 = require('sqlite3').verbose();

export interface Collection {
    id: number;
    name : string,
    content : string
}

const ErrorType : Record<string, string> = {
    "SQLITE_CONSTRAINT: UNIQUE constraint failed: User.email" : "Email already exists",
}

class CollectionDatabase {
    private static db: any;

    static {
        this.db = new sqlite3.Database('database.db', async (err: Error | null) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('[ COLLECTION ] : Connected to the SQLite database.');

                await new Promise(resolve => setTimeout(resolve, 100));

                this.db.run(`CREATE TABLE IF NOT EXISTS Collection (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT,
                            isDeleted BOOLEAN DEFAULT FALSE,
                            userRef INTEGER,
                            parent INTEGER,
                            FOREIGN KEY (userRef) REFERENCES User (id),
                            FOREIGN KEY (parent) REFERENCES Collection (id)
                        );`, (err: Error | null) => {
                    if (err) {
                        console.error('Error creating table:', err.message);
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 100));

                this.db.run(`
                            CREATE TRIGGER IF NOT EXISTS check_parent_user_update
                            BEFORE UPDATE ON Collection
                            FOR EACH ROW
                            BEGIN
                                -- Ensure that if the parent is changed, it still belongs to the same user
                                SELECT
                                CASE
                                    WHEN (NEW.parent IS NOT NULL AND
                                          (SELECT userRef FROM Collection WHERE id = NEW.parent) != NEW.userRef) THEN
                                        RAISE (ABORT, 'Parent collection does not belong to the same user')
                                END;
                            END;
                            `, (err:Error) => {

                    if (err) {
                        console.error('Error enabling foreign keys : [ COLLECTION ] : TRIGGER ', err.message);
                    }else{
                        console.log("Created trigger for Collection Update")
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 100));

                this.db.run(`
                            CREATE TRIGGER IF NOT EXISTS check_parent_user_insert
                            BEFORE INSERT ON Collection
                            FOR EACH ROW
                            BEGIN
                                -- Ensure that if a parent is assigned during insertion, it belongs to the same user
                                SELECT
                                CASE
                                    WHEN (NEW.parent IS NOT NULL AND
                                          (SELECT userRef FROM Collection WHERE id = NEW.parent) != NEW.userRef) THEN
                                        RAISE (ABORT, 'Parent collection does not belong to the same user')
                                END;
                            END;

                            `, (err:Error) => {

                    if (err) {
                        console.error('Error enabling foreign keys : [ COLLECTION ] : TRIGGER ', err.message);
                    }else{
                        console.log("Created trigger for Collection Insert")
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 100));

                this.db.run('PRAGMA foreign_keys = ON;', (err:Error) => {
                    if (err) {
                        console.error('Error enabling foreign keys : [ COLLECTION ] : ', err.message);
                    }
                });
            }
        });
    }

    static async addCollection(name : string,userId:number,parent:string|null = null): Promise<Collection | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise(async (resolve, reject) => {
            this.db.run('INSERT INTO Collection (name,userRef,parent) VALUES (?, ?, ?)', [name,userId, parent ? Number(parent) : null], async function (err: Error | null) {
                if (err) {
                    if(err.message in ErrorType){
                        reject(ErrorType[err.message]);
                    }else{
                        reject();
                    }
                } else {
                    // @ts-ignore
                    const lastId = this.lastID;

                    const collection = await CollectionDatabase.findCollectionById(lastId,userId).catch(()=>null)
                    if(!collection) return reject();

                    resolve(collection);
                }
            });
        });
    }

    static async findCollectionById(collectionId : number,userId:number): Promise<Collection | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Collection | null>((resolve, reject) => {
            this.db.get('SELECT * FROM Collection WHERE id = ? AND userRef = ?', [collectionId,userId], (err: Error | null, row: Collection | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(row || null);
                }
            });
        });
    }


    static async deleteById(collectionId: number, userId: number): Promise<true | string> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<true | string>((resolve, reject) => {
            // Start a transaction
            this.db.run('BEGIN TRANSACTION;', (err: Error | null) => {
                if (err) {
                    console.log("ERROR TRANSACTION:", err);
                    return reject(err);
                }

                // Recursive function to delete nested collections
                const deleteNestedCollections = (id: number, userId: number): Promise<void> => {
                    return new Promise((resolveNested, rejectNested) => {
                        this.db.all(
                            'SELECT id FROM Collection WHERE parent = ? AND userRef = ?;',
                            [id, userId],
                            async (err: Error | null, rows: { id: number }[]) => {
                                if (err) {
                                    console.log("ERROR FETCHING NESTED COLLECTIONS:", err);
                                    return rejectNested(err);
                                }

                                // Recursively delete each nested collection
                                    console.log("ROWS",rows)
                                for (const row of rows) {
                                    await deleteNestedCollections(row.id, userId).catch((err) => {
                                        console.log("ERROR DELETING NESTED COLLECTION:" ,row , row);
                                        return rejectNested(err);
                                    });
                                }

                                const deletePageBycCollRef = async (collId:number,userId:number) => await new Promise((res,rej)=>{
                                    this.db.run(
                                        'DELETE FROM Page WHERE collectionRef = ? AND userRef = ?;',
                                        [collId, userId],
                                        async (err: Error | null) => {
                                            if (err) {
                                                console.log("ERROR DELETE PAGE SINGLE:", err , collId , userId);
                                                rej()
                                            }else{
                                                console.log("DELETED PAGE SINGLE:", collId , userId);
                                                await new Promise((res,rej)=>{
                                                    this.db.all(
                                                        'SELECT * FROM Page WHERE collectionRef = ? AND userRef = ?;',
                                                        [id, userId],
                                                        async (err: Error | null, rows: { id: number }[]) => {
                                                            if (err) {
                                                                console.log("ERROR FETCHING NESTED PAGE:", err);
                                                                return rej();
                                                            } else {
                                                                console.log("COLL : ", rows)
                                                                res(1)
                                                            }
                                                        })
                                                }).catch(rejectNested)
                                                res(1)
                                            }
                                        }
                                    )
                                }).catch(rejectNested)

                                await deletePageBycCollRef(id,userId)

                                await new Promise((res,rej)=>{
                                    this.db.run(
                                        'DELETE FROM Collection WHERE id = ? AND userRef = ?;',
                                        [id, userId],
                                        async (err: Error | null) => {
                                            if (err) {
                                                rejectNested()
                                            }else{
                                                console.log("DELETED COLLECTION SINGLE:", id , userId);
                                            }
                                            return res(1)
                                        }
                                    )
                                }).catch(rejectNested)

                                resolveNested();
                            }
                        );
                    });
                };

                // Call the recursive delete function
                deleteNestedCollections(collectionId, userId)
                    .then(() => {
                        // Delete all pages associated with the collection
                        this.db.run(
                            'DELETE FROM Page WHERE collectionRef = ? AND userRef = ?;',
                            [collectionId, userId],
                            (err: Error | null) => {
                                if (err) {
                                    console.log("ERROR DELETE PAGES:", err);
                                    this.db.run('ROLLBACK;', () => reject(err));
                                } else {

                                    this.db.run(
                                        'DELETE FROM Collection WHERE id = ? AND userRef = ?;',
                                        [collectionId, userId],
                                        (err: Error | null) => {
                                            if (err) {
                                                console.log("ERROR DELETE COLLECTION:", err , collectionId , userId);

                                                this.db.run('ROLLBACK;', () => reject(err));
                                            } else {
                                                // Commit the transaction
                                                this.db.run('COMMIT;', (err: Error | null) => {
                                                    if (err) {
                                                        this.db.run('ROLLBACK;', () => reject(err));
                                                    } else {
                                                        resolve(true);
                                                    }
                                                });
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    })
                    .catch((err) => {
                        console.log("ERROR DELETING NESTED COLLECTIONS:", err);
                        this.db.run('ROLLBACK;', () => reject(err));
                    });
            });
        });
    }




    static async renameById(collectionId : number,userId:number,name:string): Promise<true | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<true | null>((resolve, reject) => {
            this.db.get('UPDATE Collection SET name = ? WHERE id = ? AND userRef = ?', [name,collectionId,userId], (err: Error | null, row: Collection | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async moveById(toCollection:number | null,id:number,userId:number): Promise<true | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<true | null>((resolve, reject) => {
            this.db.get('UPDATE Collection SET parent = ? WHERE id = ? AND userRef = ?', [toCollection,id,userId], (err: Error | null, row: Collection | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async findCollectionByUser(userId : number): Promise<Collection | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Collection | null>((resolve, reject) => {
            this.db.get('SELECT * FROM Collection WHERE userRef = ?', [userId], (err: Error | null, row: Collection | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(row || null);
                }
            });
        });
    }

    static async findCollectionByUserAndRoot(userId : number,parent:number|null): Promise<Collection[] | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Collection[] | null>((resolve, reject) => {
            let query = 'SELECT * FROM Collection WHERE userRef = ? AND isDeleted = 0';
            let params = [userId];

            if (parent === null) {
                query += ' AND parent IS NULL';
            } else {
                query += ' AND parent = ?';
                params.push(parent);
            }

            this.db.all(query, params, (err: Error | null, row: Collection[] | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(row || null);
                }
            });
        });
    }

    static async findCollectionByUserAndName(userId : number,name:string): Promise<Collection[] | null> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise<Collection[] | null>((resolve, reject) => {
            let query = 'SELECT * FROM Collection WHERE userRef = ? AND isDeleted = 0 AND name LIKE ?';
            let params = [userId,`%${name}%`];

            this.db.all(query, params, (err: Error | null, row: Collection[] | undefined) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(row || null);
                }
            });
        });
    }
}

export default CollectionDatabase;
