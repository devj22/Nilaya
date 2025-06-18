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

  const httpServer = createServer(app);
  return httpServer;
}
