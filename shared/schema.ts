import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("USER"), // USER, ADMIN
  coinBalance: integer("coin_balance").default(100), // Starting coins
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Game scores and achievements
export const gameScores = pgTable("game_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  score: integer("score").notNull(),
  level: integer("level").default(1),
  blessingPoints: integer("blessing_points").default(0),
  streakDays: integer("streak_days").default(0),
  lastPlayedDate: timestamp("last_played_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type GameScore = typeof gameScores.$inferSelect;
export type InsertGameScore = typeof gameScores.$inferInsert;

// Content Schema
export const contentSchema = z.object({
  id: z.string(),
  day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  category: z.enum(["Mantras", "Chalisas", "Aartis", "Stotrams", "Kathas", "Vrat Vidhi", "Extras"]),
  title: z.string(),
  textEnglish: z.string(),
  textHindi: z.string(),
  translation: z.string().optional(),
  deity: z.string().optional(),
  duration: z.string().optional(),
  emojiCounts: z.record(z.number()).default({}),
});

export const insertContentSchema = contentSchema.omit({ id: true });

// Prayer Schema
export const prayerSchema = z.object({
  id: z.string(),
  text: z.string(),
  emojiCounts: z.record(z.number()).default({}),
  createdAt: z.date(),
});

export const insertPrayerSchema = prayerSchema.omit({ id: true, emojiCounts: true, createdAt: true });

// Reaction Schema
export const reactionSchema = z.object({
  prayerId: z.string(),
  emoji: z.enum(["❤️", "🌟", "🙏"]),
});

// Game Schemas
export const gameSessionSchema = z.object({
  score: z.number().min(0),
  level: z.number().min(1),
  hits: z.number().min(0),
  attempts: z.number().min(0),
  blessingPoints: z.number().min(0),
});

// Game Score Schema for storage
export const gameScoreSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  score: z.number(),
  level: z.number().default(1),
  blessingPoints: z.number().default(0),
  playedAt: z.date(),
});

export const insertGameScoreSchema = gameScoreSchema.omit({ id: true, playedAt: true });

export type Content = z.infer<typeof contentSchema>;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Prayer = z.infer<typeof prayerSchema>;
export type InsertPrayer = z.infer<typeof insertPrayerSchema>;
export type Reaction = z.infer<typeof reactionSchema>;

// Reel Schema
export const reelSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  videoUrl: z.string(),
  thumbnailUrl: z.string().optional(),
  duration: z.number().optional(),
  views: z.number().default(0),
  likes: z.number().default(0),
  isActive: z.number().default(1),
  createdAt: z.date(),
});

export const insertReelSchema = reelSchema.omit({ id: true, views: true, likes: true, createdAt: true });

export type Reel = z.infer<typeof reelSchema>;
export type InsertReel = z.infer<typeof insertReelSchema>;

// Community Post Schema  
export const communityPostSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  content: z.string(),
  isAnonymous: z.number().default(1),
  upvotes: z.number().default(0),
  type: z.enum(["prayer", "question", "share"]).default("prayer"),
  createdAt: z.date(),
});

export const insertCommunityPostSchema = communityPostSchema.omit({ id: true, upvotes: true, createdAt: true });

export type CommunityPost = z.infer<typeof communityPostSchema>;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;

// Pooja Schema
export const poojas = pgTable("poojas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
  category: varchar("category").notNull(), // major-festivals, women-centric, seasonal, devotional-days
  featured: integer("featured").default(0), // 0 = false, 1 = true
  createdAt: timestamp("created_at").defaultNow(),
});

export const poojaContent = pgTable("pooja_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  poojaId: varchar("pooja_id").references(() => poojas.id).notNull(),
  type: varchar("type").notNull(), // aarti, mantra, kavach, siddhi, kunjika, adhyaya
  title: varchar("title").notNull(),
  textEnglish: text("text_english").notNull(),
  textHindi: text("text_hindi").notNull(),
  translation: text("translation"),
  audioUrl: varchar("audio_url"),
  adhyaya: integer("adhyaya"), // Chapter number for adhyaya type
  order: integer("order").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reels table schema
export const reels = pgTable("reels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  videoUrl: varchar("video_url").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  duration: integer("duration"), // in seconds
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community Posts table schema
export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  content: text("content").notNull(),
  isAnonymous: integer("is_anonymous").default(1),
  upvotes: integer("upvotes").default(0),
  type: varchar("type").default("prayer"), // prayer, question, share
  createdAt: timestamp("created_at").defaultNow(),
});

export const communityComments = pgTable("community_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").references(() => communityPosts.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  content: text("content").notNull(),
  isAnonymous: integer("is_anonymous").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Saved Content
export const savedContent = pgTable("saved_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  contentType: varchar("content_type").notNull(), // pooja, reel, post
  contentId: varchar("content_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Coin Transactions
export const coinTransactions = pgTable("coin_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(), // positive for earning, negative for spending
  type: varchar("type").notNull(), // game_reward, purchase, daily_bonus
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod Schemas
export const poojaSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.enum(["major-festivals", "women-centric", "seasonal", "devotional-days"]),
  featured: z.number().default(0),
  createdAt: z.date(),
});

// Pooja Content Schema
export const poojaContentSchema = z.object({
  id: z.string(),
  poojaId: z.string(),
  type: z.enum(["aarti", "mantra", "kavach", "siddhi", "kunjika", "adhyaya"]),
  title: z.string(),
  textEnglish: z.string(),
  textHindi: z.string(),
  translation: z.string().optional(),
  audioUrl: z.string().optional(),
  adhyaya: z.number().optional(), // For chapter numbering
  order: z.number(),
  createdAt: z.date(),
});

export const insertPoojaSchema = poojaSchema.omit({ id: true, createdAt: true });

// Pooja Category Schema
export const poojaCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
});

export type PoojaCategory = z.infer<typeof poojaCategorySchema>;
export const insertPoojaContentSchema = poojaContentSchema.omit({ id: true, createdAt: true });

export type Pooja = z.infer<typeof poojaSchema>;
export type InsertPooja = z.infer<typeof insertPoojaSchema>;
export type PoojaContent = z.infer<typeof poojaContentSchema>;
export type InsertPoojaContent = z.infer<typeof insertPoojaContentSchema>;



export type GameSession = z.infer<typeof gameSessionSchema>;
export type GameScore = z.infer<typeof gameScoreSchema>;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
