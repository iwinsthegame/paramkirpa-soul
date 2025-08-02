import { z } from "zod";

// Content Schema
export const contentSchema = z.object({
  id: z.string(),
  day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  category: z.enum(["Mantras", "Chalisas", "Aartis", "Stotrams"]),
  title: z.string(),
  textEnglish: z.string(),
  textHindi: z.string(),
  translation: z.string().optional(),
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

export type Content = z.infer<typeof contentSchema>;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Prayer = z.infer<typeof prayerSchema>;
export type InsertPrayer = z.infer<typeof insertPrayerSchema>;
export type Reaction = z.infer<typeof reactionSchema>;
