import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPrayerSchema, 
  reactionSchema, 
  gameSessionSchema,
  insertPoojaSchema,
  insertPoojaContentSchema,
  insertReelSchema,
  insertCommunityPostSchema
} from "@shared/schema";

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

  // New Content API Routes
  app.get("/api/v1/content/categories", async (req, res) => {
    try {
      const { day } = req.query;
      if (!day) {
        return res.status(400).json({ message: "Day parameter is required" });
      }
      
      const categories = await storage.getCategoriesByDay(day as string);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/v1/content/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // First try to get from main content storage
      let content = await storage.getContentById(id);
      
      // If not found, check if it's pooja content
      if (!content) {
        const allPoojas = await storage.getPoojas();
        for (const pooja of allPoojas) {
          const poojaContent = await storage.getPoojaContent(pooja.id);
          const foundContent = poojaContent.find(item => item.id === id);
          if (foundContent && foundContent.textHindi && foundContent.textEnglish) {
            // Convert pooja content to Content format
            content = {
              id: foundContent.id,
              day: "Special",
              category: foundContent.type || "Pooja",
              title: foundContent.title,
              textEnglish: foundContent.textEnglish,
              textHindi: foundContent.textHindi,
              translation: foundContent.translation,
              deity: "Durga",
              emojiCounts: { "🙏": 0, "❤️": 0, "🌟": 0 }
            };
            break;
          }
        }
      }
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post("/api/v1/content/:id/react", async (req, res) => {
    try {
      const { id } = req.params;
      const { emoji } = reactionSchema.parse({ prayerId: id, emoji: req.body.emoji });
      
      const updatedContent = await storage.updateContentReaction(id, emoji);
      if (!updatedContent) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(updatedContent);
    } catch (error) {
      res.status(400).json({ message: "Invalid reaction data" });
    }
  });

  // Game API Routes
  app.post("/api/v1/game/score", async (req, res) => {
    try {
      const gameData = gameSessionSchema.parse(req.body);
      const gameScore = await storage.saveGameScore({
        userId: null, // Anonymous for now
        score: gameData.score,
        level: gameData.level,
        blessingPoints: gameData.blessingPoints,
      });
      res.status(201).json(gameScore);
    } catch (error) {
      res.status(400).json({ message: "Invalid game data" });
    }
  });

  app.get("/api/v1/game/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Pooja API Routes
  app.get("/api/v1/poojas", async (req, res) => {
    try {
      const poojas = await storage.getPoojas();
      res.json(poojas);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poojas" });
    }
  });

  app.get("/api/v1/poojas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const pooja = await storage.getPoojaById(id);
      if (!pooja) {
        return res.status(404).json({ message: "Pooja not found" });
      }
      res.json(pooja);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pooja" });
    }
  });

  app.get("/api/v1/poojas/:id/content/:type", async (req, res) => {
    try {
      const { id, type } = req.params;
      const content = await storage.getPoojaContent(id, type);
      res.json(content);
    } catch (error) {
      console.error("Error fetching pooja content:", error);
      res.status(500).json({ message: "Failed to fetch pooja content" });
    }
  });

  // Reels API Routes
  app.get("/api/v1/reels", async (req, res) => {
    try {
      const reels = await storage.getReels();
      res.json(reels);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reels" });
    }
  });

  app.post("/api/v1/reels/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementReelLikes(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to like reel" });
    }
  });

  app.post("/api/v1/reels/:id/view", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementReelViews(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to record view" });
    }
  });

  // Community API Routes
  app.get("/api/v1/community/posts", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const posts = await storage.getCommunityPosts(page, limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/v1/community/posts", async (req, res) => {
    try {
      const validatedData = insertCommunityPostSchema.parse(req.body);
      const post = await storage.createCommunityPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid post data" });
    }
  });

  app.post("/api/v1/community/posts/:id/upvote", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.upvoteCommunityPost(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to upvote post" });
    }
  });

  // Games API Routes
  app.get("/api/v1/games/wallet", async (req, res) => {
    try {
      // For now, return mock data - can be enhanced with user auth
      res.json({ balance: 150 });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallet" });
    }
  });

  app.get("/api/v1/games/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getGameLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // User Profile Routes (mock for now)
  app.get("/api/v1/user/saved", async (req, res) => {
    try {
      res.json([]); // Mock empty saved content
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch saved content" });
    }
  });

  app.get("/api/v1/user/orders", async (req, res) => {
    try {
      res.json([]); // Mock empty orders
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/v1/user/coins", async (req, res) => {
    try {
      res.json({ balance: 100 }); // Mock coin balance
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coin balance" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
