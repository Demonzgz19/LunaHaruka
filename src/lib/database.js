import sqlite3 from 'sqlite3';
import Events from 'events';

class SQLiteDatabase extends Events {
    constructor(path) {
        super();
        this.db = new sqlite3.Database(path);
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY,
                        uid INTEGER NOT NULL,
                        username TEXT NOT NULL,
                        level INTEGER NOT NULL,
                        exp INTEGER NOT NULL,
                        money INTEGER NOT NULL,
                        tf INTEGER NOT NULL,
                        chat_len INTEGER NOT NULL,
                        chat_hast INTEGER NOT NULL,
                        user_avatar TEXT NOT NULL,
                        user_header TEXT NOT NULL,
                        data TEXT NOT NULL,
                        data_ba TEXT NOT NULL
                    )
                `);

                this.db.run(`
                    CREATE TABLE IF NOT EXISTS groups (
                        id INTEGER PRIMARY KEY,
                        name TEXT NOT NULL,
                        registed BOOLEAN NOT NULL,
                        has_warn BOOLEAN NOT NULL,
                        warn_total INTEGER NOT NULL
                    )
                `);

                this.db.run(`
                    CREATE TABLE IF NOT EXISTS guild (
                        id INTEGER PRIMARY KEY,
                        name TEXT NOT NULL
                    )
                `);

                this.emit('initialized', "Database berhasil diinisialisasi.");
                resolve("Database berhasil diinisialisasi.");
            });
        });
    }

    async update(query, params) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function (err) {
                if (err) {
                    this.emit("error", err);
                    reject(err.message);
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    }

    async check(query, params) {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) {
                    this.emit("error", err);
                    reject(err.message);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async del(query, params) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function (err) {
                if (err) {
                    this.emit("error", err);
                    reject(err.message);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    async reset() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(`DELETE FROM users`);
                this.db.run(`DELETE FROM groups`);
                this.db.run(`DELETE FROM guild`);

                resolve("Database telah direset.");
            });
        });
    }

    close() {
        this.db.close();
    }
}

export default SQLiteDatabase;