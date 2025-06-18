import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create lead endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      res.json({ success: true, lead });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid lead data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to create lead" 
        });
      }
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

      const { db } = await import("./db");
      const result = await db.execute(query);
      
      res.json({
        success: true,
        rows: result.rows || result,
        rowCount: result.rows?.length || 0,
        query: query
      });
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
      const { db } = await import("./db");
      const tablesResult = await db.execute(`
        SELECT table_name, table_type 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      res.json({
        success: true,
        tables: tablesResult.rows || tablesResult
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
      const { db } = await import("./db");
      
      const structureResult = await db.execute(`
        SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [table]);
      
      res.json({
        success: true,
        structure: structureResult.rows || structureResult
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
