import mysql from 'mysql2/promise';

// Parse cPanel database name format (user_database@host)
const databaseString = process.env.MYSQL_DATABASE || 'nilaya_db';
const [actualDatabase, hostFromDb] = databaseString.includes('@') ? 
  databaseString.split('@') : [databaseString, null];

// MySQL connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || hostFromDb || 'localhost',
  user: process.env.MYSQL_USER || 'root', 
  password: process.env.MYSQL_PASSWORD || '',
  database: actualDatabase,
  port: 3306,
  connectTimeout: 30000
};

console.log('MySQL connection config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port
});

// Create connection pool
export const pool = mysql.createPool(dbConfig);

// Initialize database and tables
export async function initializeDatabase() {
  try {
    // Test connection to existing database
    const testConnection = await pool.getConnection();
    console.log(`Successfully connected to MySQL database: ${dbConfig.database} at ${dbConfig.host}`);
    testConnection.release();

    // Create tables if they don't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        plot_size VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('MySQL database and tables initialized successfully');
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
    console.log('Note: Make sure your cPanel MySQL database is accessible from external connections');
    console.log('Falling back to memory storage for now...');
    // Don't throw error, let the app continue with memory storage
  }
}

// Database operations
export class MySQLStorage {
  async getUser(id: number) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return (rows as any[])[0] || undefined;
  }

  async getUserByUsername(username: string) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    return (rows as any[])[0] || undefined;
  }

  async createUser(userData: { username: string; password: string }) {
    const [result] = await pool.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [userData.username, userData.password]
    );
    const insertId = (result as any).insertId;
    return this.getUser(insertId);
  }

  async createLead(leadData: { name: string; phone: string; email: string; plotSize?: string; message?: string }) {
    const [result] = await pool.execute(
      'INSERT INTO leads (name, phone, email, plot_size, message) VALUES (?, ?, ?, ?, ?)',
      [leadData.name, leadData.phone, leadData.email, leadData.plotSize || null, leadData.message || null]
    );
    const insertId = (result as any).insertId;
    
    const [rows] = await pool.execute('SELECT * FROM leads WHERE id = ?', [insertId]);
    return (rows as any[])[0];
  }

  async getLeads() {
    const [rows] = await pool.execute('SELECT * FROM leads ORDER BY created_at DESC');
    return rows as any[];
  }

  async executeQuery(query: string) {
    try {
      const [rows, fields] = await pool.execute(query);
      return {
        success: true,
        rows: rows as any[],
        fields: fields as any[],
        rowCount: Array.isArray(rows) ? rows.length : 0
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
      const [rows] = await pool.execute(`
        SELECT table_name, table_type 
        FROM information_schema.tables 
        WHERE table_schema = ?
        ORDER BY table_name
      `, [dbConfig.database]);
      
      return {
        success: true,
        tables: rows as any[]
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
      const [rows] = await pool.execute(`
        SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
        FROM information_schema.columns 
        WHERE table_schema = ? AND table_name = ?
        ORDER BY ordinal_position
      `, [dbConfig.database, tableName]);
      
      return {
        success: true,
        structure: rows as any[]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}