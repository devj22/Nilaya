import type { Express } from "express";
import { createServer, type Server } from "http";
import { MySQLStorage, initializeDatabase } from "./mysql-db";
import { SQLiteStorage, initializeDatabase as initSQLite } from "./sqlite-db";
import { DatabaseStorage } from "./storage";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

let storage: DatabaseStorage;
let databaseType = 'unknown';

// Set up multer storage for gallery uploads
const galleryStorage = multer.diskStorage({
  destination: function (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, path.join(__dirname, "uploads/gallery"));
  },
  filename: function (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage: galleryStorage });

export async function registerRoutes(app: Express): Promise<Server> {
  storage = new DatabaseStorage();
  await storage.getLeads(); // Test query
  databaseType = 'PostgreSQL (Neon/Drizzle)';
  console.log('Successfully connected to PostgreSQL database');

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
      const result = await storage.getTables();
      res.json(result);
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
      const result = await storage.getTableStructure(table);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch table structure"
      });
    }
  });

  // Serve gallery uploads as static files
  app.use("/uploads/gallery", express.static(path.join(__dirname, "uploads/gallery")));

  // Upload image endpoint
  app.post("/api/gallery/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const fileUrl = `/uploads/gallery/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  });

  // List gallery images endpoint
  app.get("/api/gallery", (req, res) => {
    const galleryDir = path.join(__dirname, "uploads/gallery");
    fs.readdir(galleryDir, (err, files) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Failed to list images" });
      }
      const urls = files
        .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
        .map(f => `/uploads/gallery/${f}`);
      res.json({ success: true, images: urls });
    });
  });

  // Delete gallery image endpoint (admin only)
  app.delete("/api/gallery/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "uploads/gallery", filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(404).json({ success: false, message: "File not found" });
      }
      res.json({ success: true });
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
