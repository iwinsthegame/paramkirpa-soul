import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPrayerSchema, reactionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Content API Routes
  app.get("/api/v1/content", async (req, res) => {
    try {
      const { day, category, language } = req.query;
      
      if (category && day) {
        const content = await storage.getContentByCategory(
          category as string, 
          day as string, 
          language as string
        );
        res.json(content);
      } else if (day) {
        const content = await storage.getContentByDay(day as string, language as string);
        res.json(content);
      } else {
        res.status(400).json({ message: "Day parameter is required" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get("/api/v1/content/featured", async (req, res) => {
    try {
      const { day } = req.query;
      if (!day) {
        return res.status(400).json({ message: "Day parameter is required" });
      }
      
      const featuredContent = await storage.getFeaturedContent(day as string);
      if (!featuredContent) {
        return res.status(404).json({ message: "No featured content found" });
      }
      
      res.json(featuredContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured content" });
    }
  });

  // Prayer API Routes
  app.post("/api/v1/prayers", async (req, res) => {
    try {
      const validatedData = insertPrayerSchema.parse(req.body);
      const prayer = await storage.createPrayer(validatedData);
      res.status(201).json(prayer);
    } catch (error) {
      res.status(400).json({ message: "Invalid prayer data" });
    }
  });

  app.get("/api/v1/prayers", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const prayers = await storage.getPrayers(page, limit);
      res.json(prayers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prayers" });
    }
  });

  app.post("/api/v1/prayers/:id/react", async (req, res) => {
    try {
      const { id } = req.params;
      const { emoji } = reactionSchema.parse({ prayerId: id, emoji: req.body.emoji });
      
      const updatedPrayer = await storage.updatePrayerReaction(id, emoji);
      if (!updatedPrayer) {
        return res.status(404).json({ message: "Prayer not found" });
      }
      
      res.json(updatedPrayer);
    } catch (error) {
      res.status(400).json({ message: "Invalid reaction data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
