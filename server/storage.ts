import { type Content, type InsertContent, type Prayer, type InsertPrayer } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Content methods
  getContentByDay(day: string, language?: string): Promise<Content[]>;
  getContentByCategory(category: string, day: string, language?: string): Promise<Content[]>;
  getFeaturedContent(day: string): Promise<Content | undefined>;
  
  // Prayer methods
  createPrayer(prayer: InsertPrayer): Promise<Prayer>;
  getPrayers(page?: number, limit?: number): Promise<Prayer[]>;
  getPrayerById(id: string): Promise<Prayer | undefined>;
  updatePrayerReaction(prayerId: string, emoji: string): Promise<Prayer | undefined>;
}

export class MemStorage implements IStorage {
  private contents: Map<string, Content>;
  private prayers: Map<string, Prayer>;

  constructor() {
    this.contents = new Map();
    this.prayers = new Map();
    this.initializeContent();
  }

  private initializeContent() {
    // Initialize with sample devotional content for all days
    const sampleContents: Content[] = [
      // Sunday
      {
        id: "1",
        day: "Sunday",
        category: "Mantras",
        title: "Surya Mantra",
        textEnglish: "Om Surya Bhaskaraya Namaha\nOm Utrabodhaya Namaha\nOm Loka Pradipaya Namaha\nOm Tejase Namaha",
        textHindi: "ॐ सूर्य भास्कराय नमः\nॐ उत्रबोधाय नमः\nॐ लोक प्रदीपाय नमः\nॐ तेजसे नमः",
        translation: "I bow to the Sun God, the illuminator, the awakener, the lamp of the world, the radiant one."
      },
      // Monday  
      {
        id: "2",
        day: "Monday",
        category: "Mantras",
        title: "Gayatri Mantra",
        textEnglish: "Om Bhur Bhuvaḥ Swaḥ\nTat-savitur Vareñyaṃ\nBhargo Devasya Dhīmahi\nDhiyo Yonaḥ Prachodayāt",
        textHindi: "ॐ भूर्भुवः स्वः\nतत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि\nधियो यो नः प्रचोदयात्",
        translation: "We meditate on the glory of the Creator who has created the Universe, who is worthy of worship, who is the embodiment of knowledge and light, who is the remover of sin and ignorance. May he enlighten our intellect."
      },
      // Tuesday
      {
        id: "3",
        day: "Tuesday",
        category: "Chalisas",
        title: "Hanuman Chalisa",
        textEnglish: "Shri Guru Charan Saroj Raj\nNij Man Mukur Sudhari\nBarnau Raghubar Bimal Jasu\nJo Dayaku Phal Chari",
        textHindi: "श्रीगुरु चरन सरोज रज\nनिज मन मुकुर सुधारि\nबरनउं रघुबर बिमल जसु\nजो दायक फल चारि",
        translation: "With the dust of Guru's Lotus feet, I clean the mirror of my mind and then narrate the sacred glory of Sri Ram Chandra, The Supreme among the Raghu dynasty. The giver of the four attainments of life."
      },
      // Wednesday
      {
        id: "4",
        day: "Wednesday",
        category: "Aartis",
        title: "Ganga Aarti",
        textEnglish: "Om Jai Gange Mata\nMaiya Jai Gange Mata\nJo Nar Tumko Dhyaata\nManokamana Paata",
        textHindi: "ॐ जय गंगे माता\nमैया जय गंगे माता\nजो नर तुमको ध्याता\nमनोकामना पाता",
        translation: "Victory to Mother Ganga! Those who meditate upon you, their heart's desires are fulfilled."
      },
      // Thursday
      {
        id: "5",
        day: "Thursday",
        category: "Stotrams",
        title: "Vishnu Sahasranama",
        textEnglish: "Vishvam Vishnur Vashatkaro\nBhuta-bhavya-bhavat-prabhuh\nBhutakrid Bhutabhrid Bhavo\nBhutatma Bhuta-bhavanah",
        textHindi: "विश्वं विष्णुर्वषट्कारो\nभूत-भव्य-भवत्-प्रभुः\nभूतकृद् भूतभृद् भावो\nभूतात्मा भूत-भावनः",
        translation: "The Universe, The All-Pervading, The Performer of Sacrifices, The Lord of Past, Present and Future, The Creator of Elements, The Sustainer of Elements, The Existence, The Soul of Elements, The Contemplator of Elements."
      },
      // Friday
      {
        id: "6",
        day: "Friday",
        category: "Aartis",
        title: "Lakshmi Aarti",
        textEnglish: "Om Jai Lakshmi Mata\nMaiya Jai Lakshmi Mata\nTumko Nisdin Dhyavat\nHara Vishnu Viridata",
        textHindi: "ॐ जय लक्ष्मी माता\nमैया जय लक्ष्मी माता\nतुमको निसदिन ध्यावत\nहर विष्णु विरिदाता",
        translation: "Victory to Mother Lakshmi! Day and night, Lord Vishnu and Lord Shiva meditate upon you."
      },
      // Saturday  
      {
        id: "7",
        day: "Saturday",
        category: "Mantras",
        title: "Shani Mantra",
        textEnglish: "Om Shanaischaraya Namaha\nOm Suryaputraya Namaha\nOm Bhauma Graha Rakshine Namaha\nOm Shani Devaya Namaha",
        textHindi: "ॐ शनैश्चराय नमः\nॐ सूर्यपुत्राय नमः\nॐ भौम ग्रह रक्षिणे नमः\nॐ शनि देवाय नमः",
        translation: "I bow to Lord Shani, the slow-moving one, son of the Sun, protector from malefic planetary influences."
      }
    ];

    sampleContents.forEach(content => {
      this.contents.set(content.id, content);
    });
  }

  async getContentByDay(day: string, language?: string): Promise<Content[]> {
    const dayContents = Array.from(this.contents.values()).filter(
      content => content.day === day
    );
    return dayContents;
  }

  async getContentByCategory(category: string, day: string, language?: string): Promise<Content[]> {
    const categoryContents = Array.from(this.contents.values()).filter(
      content => content.category === category && content.day === day
    );
    return categoryContents;
  }

  async getFeaturedContent(day: string): Promise<Content | undefined> {
    const dayContents = await this.getContentByDay(day);
    return dayContents[0]; // Return first content as featured
  }

  async createPrayer(insertPrayer: InsertPrayer): Promise<Prayer> {
    const id = randomUUID();
    const prayer: Prayer = {
      ...insertPrayer,
      id,
      emojiCounts: { "❤️": 0, "🌟": 0, "🙏": 0 },
      createdAt: new Date(),
    };
    this.prayers.set(id, prayer);
    return prayer;
  }

  async getPrayers(page = 1, limit = 10): Promise<Prayer[]> {
    const allPrayers = Array.from(this.prayers.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return allPrayers.slice(startIndex, endIndex);
  }

  async getPrayerById(id: string): Promise<Prayer | undefined> {
    return this.prayers.get(id);
  }

  async updatePrayerReaction(prayerId: string, emoji: string): Promise<Prayer | undefined> {
    const prayer = this.prayers.get(prayerId);
    if (!prayer) return undefined;

    prayer.emojiCounts[emoji] = (prayer.emojiCounts[emoji] || 0) + 1;
    this.prayers.set(prayerId, prayer);
    return prayer;
  }
}

export const storage = new MemStorage();
