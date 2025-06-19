import { users, leads, type User, type InsertUser, type Lead, type InsertLead } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  executeQuery(query: string): Promise<{ success: boolean; rows: any[]; fields: any[]; rowCount: number }>;
  getTables(): Promise<{ success: boolean; tables: any[] }>;
  getTableStructure(tableName: string): Promise<{ success: boolean; structure: any[] }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values(insertLead)
      .returning();
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt));
  }

  async executeQuery(query: string) {
    try {
      const result = await db.execute(query);
      return {
        success: true,
        rows: result.rows || [],
        fields: result.fields || [],
        rowCount: Array.isArray(result.rows) ? result.rows.length : 0
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        rowCount: 0,
        rows: [],
        fields: []
      };
    }
  }

  async getTables() {
    try {
      const result = await db.execute(`
        SELECT table_name, table_type 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      return {
        success: true,
        tables: result.rows || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        tables: []
      };
    }
  }

  async getTableStructure(tableName: string) {
    try {
      const result = await db.execute(`
        SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = '${tableName}'
        ORDER BY ordinal_position
      `);
      return {
        success: true,
        structure: result.rows || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        structure: []
      };
    }
  }
}

export const storage = new DatabaseStorage();
