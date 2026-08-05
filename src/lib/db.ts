import Database from 'better-sqlite3';
import path from 'path';

// Define DB path inside the workspace
const DB_PATH = path.join(process.cwd(), 'db.sqlite');

export const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize database schema
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

// Apply column additions gracefully if database already exists
try { db.exec("ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 1;"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN verification_code TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN reset_token TEXT;"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN reset_token_expiry TEXT;"); } catch (e) {}

// Seed Master VIP QA Account for automated AI testing & product evaluation
try {
  const existingQa = db.prepare('SELECT id FROM users WHERE email = ?').get('ai-qa-tester@contextskeleton.com');
  if (!existingQa) {
    db.prepare(`
      INSERT INTO users (id, email, password, subscription_status, credits, email_verified)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(
      'qa-vip-master-account-id',
      'ai-qa-tester@contextskeleton.com',
      '$2b$10$feqdvGq0iXYHGybWF8h91ukO/8EVcCAGMjTRRf301MWZ99TI9.RPi',
      'ACTIVE',
      99999
    );
    console.log('✓ Master VIP QA Tester Account seeded successfully (email: ai-qa-tester@contextskeleton.com)');
  }
} catch (err) {
  console.error('QA account seed error:', err);
}

console.log('SQLite database initialized successfully at:', DB_PATH);
