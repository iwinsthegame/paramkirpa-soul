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
export type GameSession = z.infer<typeof gameSessionSchema>;
export type GameScore = z.infer<typeof gameScoreSchema>;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
