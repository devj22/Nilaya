import Database from 'better-sqlite3';
import { join } from 'path';

// Initialize SQLite database
const dbPath = join(process.cwd(), 'database.db');
export const db = new Database(dbPath);

// Initialize database and tables
export function initializeDatabase() {
  try {
    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create leads table
    db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        plot_size TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('SQLite database and tables initialized successfully');
  } catch (error) {
    console.error('Error initializing SQLite database:', error);
  }
}

// Database operations
export class SQLiteStorage {
  async getUser(id: number) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  async getUserByUsername(username: string) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  }

  async createUser(userData: { username: string; password: string }) {
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const result = stmt.run(userData.username, userData.password);
    return this.getUser(result.lastInsertRowid as number);
  }

  async createLead(leadData: { name: string; phone: string; email: string; plotSize?: string; message?: string }) {
    const stmt = db.prepare('INSERT INTO leads (name, phone, email, plot_size, message) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(
      leadData.name, 
      leadData.phone, 
      leadData.email, 
      leadData.plotSize || null, 
      leadData.message || null
    );
    
    const getStmt = db.prepare('SELECT * FROM leads WHERE id = ?');
    return getStmt.get(result.lastInsertRowid as number);
  }

  async getLeads() {
    const stmt = db.prepare('SELECT * FROM leads ORDER BY created_at DESC');
    return stmt.all();
  }

  async executeQuery(query: string) {
    try {
      // For SELECT queries
      if (query.trim().toUpperCase().startsWith('SELECT')) {
        const stmt = db.prepare(query);
        const rows = stmt.all();
        return {
          success: true,
          rows: rows,
          rowCount: rows.length
        };
      }
      
      // For other queries (INSERT, UPDATE, etc.)
      const stmt = db.prepare(query);
      const result = stmt.run();
      return {
        success: true,
        rows: [],
        rowCount: result.changes || 0,
        affectedRows: result.changes,
        insertId: result.lastInsertRowid
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        rowCount: 0
      };
    }
  }

  async getTables() {
    try {
      const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
      const tables = stmt.all();
      return {
        success: true,
        tables: tables.map((t: any) => ({ table_name: t.name, table_type: 'BASE TABLE' }))
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTableStructure(tableName: string) {
    try {
      const stmt = db.prepare(`PRAGMA table_info(${tableName})`);
      const columns = stmt.all();
      return {
        success: true,
        structure: columns.map((col: any) => ({
          column_name: col.name,
          data_type: col.type,
          is_nullable: col.notnull ? 'NO' : 'YES',
          column_default: col.dflt_value,
          primary_key: col.pk ? 'YES' : 'NO'
        }))
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}