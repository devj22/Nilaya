import type { Express } from "express";
import { createServer, type Server } from "http";
import { SQLiteStorage, initializeDatabase } from "./sqlite-db";
import { z } from "zod";

const storage = new SQLiteStorage();

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize MySQL database
  await initializeDatabase();

  // Create lead endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const { name, phone, email, plotSize, message } = req.body;
      
      if (!name || !phone || !email) {
        return res.status(400).json({ 
          success: false, 
          message: "Name, phone, and email are required" 
        });
      }

      const lead = await storage.createLead({ name, phone, email, plotSize, message });
      res.json({ success: true, lead });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to create lead",
        error: error.message
      });
    }
  });

  // Simple admin authentication middleware
  const adminAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer admin123') {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized" 
      });
    }
    next();
  };

  // Get leads endpoint (for admin purposes)
  app.get("/api/leads", adminAuth, async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json({ success: true, leads });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch leads" 
      });
    }
  });

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    const { password } = req.body;
    if (password === "admin123") {
      res.json({ 
        success: true, 
        token: "admin123",
        message: "Login successful"
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: "Invalid password" 
      });
    }
  });

  // Database management endpoints
  app.post("/api/database/execute", adminAuth, async (req, res) => {
    try {
      const { query } = req.body;
      
      // Safety check for dangerous operations
      const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER'];
      const upperQuery = query.toUpperCase();
      const isDangerous = dangerousKeywords.some(keyword => upperQuery.includes(keyword));
      
      if (isDangerous) {
        return res.status(400).json({
          success: false,
          error: "Dangerous operations are not allowed through this interface"
        });
      }

      const result = await storage.executeQuery(query);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || "Query execution failed",
        query: req.body.query
      });
    }
  });

  app.get("/api/database/tables", adminAuth, async (req, res) => {
    try {
      const result = await storage.executeQuery(`
        SELECT table_name, table_type 
        FROM information_schema.tables 
        WHERE table_schema = 'nilaya_db'
        ORDER BY table_name
      `);
      
      res.json({
        success: true,
        tables: result.rows || []
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch table information"
      });
    }
  });

  app.get("/api/database/structure/:table", adminAuth, async (req, res) => {
    try {
      const { table } = req.params;
      
      const result = await storage.executeQuery(`
        SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
        FROM information_schema.columns 
        WHERE table_schema = 'nilaya_db' AND table_name = '${table}'
        ORDER BY ordinal_position
      `);
      
      res.json({
        success: true,
        structure: result.rows || []
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch table structure"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
