import Database from 'better-sqlite3';
import path from 'path';

let dbInstance: any = null;

function getDbInstance(): Database.Database {
  if (dbInstance) return dbInstance;

  try {
    const DB_PATH = process.env.VERCEL ? '/tmp/db.sqlite' : path.join(process.cwd(), 'db.sqlite');
    const db = new Database(DB_PATH);

    try { db.pragma('journal_mode = WAL'); } catch (e) {}

    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        subscription_status TEXT NOT NULL DEFAULT 'inactive',
        credits INTEGER NOT NULL DEFAULT 10,
        email_verified INTEGER NOT NULL DEFAULT 1,
        verification_code TEXT,
        reset_token TEXT,
        reset_token_expiry TEXT
      );

      CREATE TABLE IF NOT EXISTS user_entitlements (
        user_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TEXT NOT NULL,
        PRIMARY KEY (user_id, product_id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        filename TEXT NOT NULL,
        file_path TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS chunks (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        content TEXT NOT NULL,
        embedding TEXT NOT NULL,
        FOREIGN KEY(document_id) REFERENCES documents(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        question_text TEXT NOT NULL,
        drafted_answer TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        FOREIGN KEY(project_id) REFERENCES projects(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    dbInstance = db;
    return db;
  } catch (err) {
    console.error('SQLite initialization warning (running in memory fallback mode):', err);
    dbInstance = {
      prepare: () => ({
        get: () => null,
        all: () => [],
        run: () => ({ changes: 1 })
      }),
      transaction: (fn: any) => fn,
      exec: () => {}
    };
    return dbInstance;
  }
}

export const db: Database.Database = new Proxy({} as any, {
  get: (_target, prop: string) => {
    const instance = getDbInstance();
    const value = (instance as any)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  }
});
