import { type Content, type InsertContent, type Prayer, type InsertPrayer } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Content methods
  getContentByDay(day: string, language?: string): Promise<Content[]>;
  getContentByCategory(category: string, day: string, language?: string): Promise<Content[]>;
  getFeaturedContent(day: string): Promise<Content | undefined>;
  getContentById(id: string): Promise<Content | undefined>;
  updateContentReaction(contentId: string, emoji: string): Promise<Content | undefined>;
  getCategoriesByDay(day: string): Promise<string[]>;
  
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
    // Initialize with comprehensive devotional content for all days and categories
    const sampleContents: Content[] = [
      // SUNDAY - Sun God Worship
      {
        id: "sun-1",
        day: "Sunday",
        category: "Mantras",
        title: "Surya Gayatri Mantra",
        textEnglish: "Om Bhaskaraya Vidmahe\nMahadyutikaraya Dhimahi\nTanno Adityah Prachodayat",
        textHindi: "ॐ भास्कराय विद्महे\nमहाद्युतिकराय धीमहि\nतन्नो आदित्यः प्रचोदयात्",
        translation: "We know the brilliant Sun, we meditate on the great effulgent one, may the Sun God inspire our understanding.",
        deity: "Surya",
        emojiCounts: { "🙏": 15, "❤️": 8, "🌟": 12 }
      },
      {
        id: "sun-2",
        day: "Sunday",
        category: "Aartis",
        title: "Surya Aarti",
        textEnglish: "Om Jai Surya Bhagawan\nHara Sab Ko Klesh Santan\nPrakash Karo Jagat Mein\nHara Andhakar Jeevan Mein",
        textHindi: "ॐ जय सूर्य भगवान्\nहर सब को क्लेश संतान\nप्रकाश करो जगत में\nहर अंधकार जीवन में",
        translation: "Victory to Lord Sun! Remove all troubles and sorrows, illuminate the world, dispel darkness from life.",
        deity: "Surya",
        emojiCounts: { "🙏": 20, "❤️": 12, "🌟": 18 }
      },
      {
        id: "sun-3",
        day: "Sunday",
        category: "Stotrams",
        title: "Aditya Hridayam",
        textEnglish: "Aditya Hridayam Punyam\nSarva Shatru Vinashakam\nJayavaham Jape Nityam\nAkshayam Paramam Shivam",
        textHindi: "आदित्य हृदयं पुण्यं\nसर्व शत्रु विनाशकम्\nजयावहं जपे नित्यं\nअक्षयं परमं शिवम्",
        translation: "The sacred Aditya Hridayam destroys all enemies, brings victory when chanted daily, and grants eternal auspiciousness.",
        deity: "Surya",
        emojiCounts: { "🙏": 25, "❤️": 15, "🌟": 22 }
      },

      // MONDAY - Lord Shiva Worship
      {
        id: "mon-1",
        day: "Monday",
        category: "Mantras",
        title: "Mahamrityunjaya Mantra",
        textEnglish: "Om Tryambakam Yajamahe\nSugandhim Pushti Vardhanam\nUrvarukamiva Bandhanan\nMrityor Mukshiya Maamritat",
        textHindi: "ॐ त्र्यम्बकं यजामहे\nसुगन्धिं पुष्टि वर्धनम्\nउर्वारुकमिव बन्धनान्\nमृत्योर्मुक्षीय मामृतात्",
        translation: "We worship the three-eyed Lord Shiva who is fragrant and nourishes all. Like a cucumber from its bondage, may we be liberated from death and attain immortality.",
        deity: "Shiva",
        emojiCounts: { "🙏": 30, "❤️": 20, "🌟": 25 }
      },
      {
        id: "mon-2",
        day: "Monday",
        category: "Chalisas",
        title: "Shiva Chalisa",
        textEnglish: "Jai Girijapati Hridaya Harasha\nMatadamber Mana Kiye Prakasha\nRatna Jatit Shish Phani Rajit\nKshana Kshana Anand Adhik Sajit",
        textHindi: "जै गिरिजापति हृदय हर्ष\nमातदम्बर मन कीये प्रकाश\nरत्न जटित शीश फणि राजित\nक्षण क्षण आनंद अधिक साजित",
        translation: "Hail to Lord of Parvati, joy of the heart, illuminating the mind like a mother's embrace, adorned with jewels in his matted hair with serpents, ever increasing in bliss moment by moment.",
        deity: "Shiva",
        emojiCounts: { "🙏": 35, "❤️": 25, "🌟": 28 }
      },
      {
        id: "mon-3",
        day: "Monday",
        category: "Vrat Vidhi",
        title: "Somvar Vrat Vidhi",
        textEnglish: "1. Wake up before sunrise\n2. Take a holy bath\n3. Wear clean white clothes\n4. Offer water to Shiva Linga\n5. Chant Om Namah Shivaya 108 times\n6. Observe fast with fruits and milk\n7. Break fast after evening prayers",
        textHindi: "१. सूर्योदय से पहले उठें\n२. पवित्र स्नान करें\n३. स्वच्छ सफेद वस्त्र धारण करें\n४. शिवलिंग पर जल चढ़ाएं\n५. ॐ नमः शिवाय १०८ बार जाप करें\n६. फल और दूध से व्रत रखें\n७. संध्या आरती के बाद व्रत तोड़ें",
        translation: "Monday fasting procedure for Lord Shiva worship to gain his blessings and remove obstacles.",
        deity: "Shiva",
        emojiCounts: { "🙏": 18, "❤️": 10, "🌟": 15 }
      },

      // TUESDAY - Hanuman Worship
      {
        id: "tue-1",
        day: "Tuesday",
        category: "Mantras",
        title: "Hanuman Beej Mantra",
        textEnglish: "Om Hanumate Namaha\nOm Anjaneya Namaha\nOm Mahabalaya Namaha\nOm Vira Hanumate Namaha",
        textHindi: "ॐ हनुमते नमः\nॐ आञ्जनेय नमः\nॐ महाबलाय नमः\nॐ वीर हनुमते नमः",
        translation: "I bow to Hanuman, son of Anjana, the mighty one, the brave Hanuman.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 40, "❤️": 30, "🌟": 35 }
      },
      {
        id: "tue-2",
        day: "Tuesday",
        category: "Chalisas",
        title: "Hanuman Chalisa",
        textEnglish: "Shri Guru Charan Saroj Raj\nNij Man Mukur Sudhari\nBarnau Raghubar Bimal Jasu\nJo Dayaku Phal Chari",
        textHindi: "श्रीगुरु चरन सरोज रज\nनिज मन मुकुर सुधारि\nबरनउं रघुबर बिमल जसु\nजो दायक फल चारि",
        translation: "With the dust of Guru's lotus feet, I clean the mirror of my mind and narrate the sacred glory of Sri Ram.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 50, "❤️": 40, "🌟": 45 }
      },
      {
        id: "tue-3",
        day: "Tuesday",
        category: "Kathas",
        title: "Hanuman Birth Story",
        textEnglish: "Long ago, Vayu, the wind god, fell in love with Anjana, a celestial apsara. Their union blessed the world with Hanuman, born with divine strength and unwavering devotion to Lord Rama. From childhood, Hanuman displayed extraordinary powers - he once leapt towards the sun thinking it was a fruit!",
        textHindi: "बहुत समय पहले, वायु देव का अंजना नामक अप्सरा से प्रेम हुआ। उनके मिलन से हनुमान का जन्म हुआ, जो दिव्य शक्ति और राम भक्ति से भरे थे। बचपन से ही हनुमान में असाधारण शक्तियां थीं - एक बार उन्होंने सूर्य को फल समझकर उसकी ओर छलांग लगाई थी!",
        translation: "The divine birth story of Hanuman and his extraordinary childhood displaying supernatural powers.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 22, "❤️": 18, "🌟": 20 }
      },

      // WEDNESDAY - Ganesha & Krishna Worship
      {
        id: "wed-1",
        day: "Wednesday",
        category: "Mantras",
        title: "Ganesha Mantra",
        textEnglish: "Om Gam Ganapataye Namaha\nVakratunda Mahakaya\nSurya Koti Samaprabha\nNirvighnam Kuru Me Deva",
        textHindi: "ॐ गं गणपतये नमः\nवक्रतुण्ड महाकाय\nसूर्य कोटि समप्रभ\nनिर्विघ्नं कुरु मे देव",
        translation: "Om, I bow to Lord Ganesha. O curved-trunk, mighty-bodied one, with the brilliance of a million suns, please remove all obstacles from my path.",
        deity: "Ganesha",
        emojiCounts: { "🙏": 45, "❤️": 35, "🌟": 40 }
      },
      {
        id: "wed-2",
        day: "Wednesday",
        category: "Aartis",
        title: "Ganga Aarti",
        textEnglish: "Om Jai Gange Mata\nMaiya Jai Gange Mata\nJo Nar Tumko Dhyaata\nManokamana Paata",
        textHindi: "ॐ जय गंगे माता\nमैया जय गंगे माता\nजो नर तुमको ध्याता\nमनोकामना पाता",
        translation: "Victory to Mother Ganga! Those who meditate upon you, their heart's desires are fulfilled.",
        deity: "Ganga",
        emojiCounts: { "🙏": 38, "❤️": 25, "🌟": 32 }
      },

      // THURSDAY - Vishnu & Guru Worship
      {
        id: "thu-1",
        day: "Thursday",
        category: "Mantras",
        title: "Vishnu Mantra",
        textEnglish: "Om Namo Bhagavate Vasudevaya\nOm Narsimhaya Namaha\nOm Govindaya Namaha\nOm Madhavaya Namaha",
        textHindi: "ॐ नमो भगवते वासुदेवाय\nॐ नरसिंहाय नमः\nॐ गोविन्दाय नमः\nॐ माधवाय नमः",
        translation: "I bow to Lord Vasudeva, to Narasimha, to Govinda, to Madhav - all forms of Lord Vishnu.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 42, "❤️": 28, "🌟": 38 }
      },
      {
        id: "thu-2",
        day: "Thursday",
        category: "Stotrams",
        title: "Vishnu Sahasranama",
        textEnglish: "Vishvam Vishnur Vashatkaro\nBhuta-bhavya-bhavat-prabhuh\nBhutakrid Bhutabhrid Bhavo\nBhutatma Bhuta-bhavanah",
        textHindi: "विश्वं विष्णुर्वषट्कारो\nभूत-भव्य-भवत्-प्रभुः\nभूतकृद् भूतभृद् भावो\nभूतात्मा भूत-भावनः",
        translation: "The Universe, The All-Pervading, The Performer of Sacrifices, The Lord of Past, Present and Future.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 55, "❤️": 45, "🌟": 50 }
      },

      // FRIDAY - Lakshmi & Devi Worship
      {
        id: "fri-1",
        day: "Friday",
        category: "Mantras",
        title: "Lakshmi Mantra",
        textEnglish: "Om Shreem Mahalakshmiyei Namaha\nOm Gam Shreem Gam Shreem\nGanapataye Shreem Namaha\nSarva Mangala Mangalye",
        textHindi: "ॐ श्रीं महालक्ष्म्यै नमः\nॐ गं श्रीं गं श्रीं\nगणपतये श्रीं नमः\nसर्व मंगल मांगल्ये",
        translation: "I bow to Goddess Mahalakshmi. Om, the auspicious one among all auspicious beings.",
        deity: "Lakshmi",
        emojiCounts: { "🙏": 48, "❤️": 35, "🌟": 42 }
      },
      {
        id: "fri-2",
        day: "Friday",
        category: "Aartis",
        title: "Lakshmi Aarti",
        textEnglish: "Om Jai Lakshmi Mata\nMaiya Jai Lakshmi Mata\nTumko Nisdin Dhyavat\nHara Vishnu Viridata",
        textHindi: "ॐ जय लक्ष्मी माता\nमैया जय लक्ष्मी माता\nतुमको निसदिन ध्यावत\nहर विष्णु विरिदाता",
        translation: "Victory to Mother Lakshmi! Day and night, Lord Vishnu and Lord Shiva meditate upon you.",
        deity: "Lakshmi",
        emojiCounts: { "🙏": 40, "❤️": 30, "🌟": 35 }
      },

      // SATURDAY - Shani Dev Worship
      {
        id: "sat-1",
        day: "Saturday",
        category: "Mantras",
        title: "Shani Mantra",
        textEnglish: "Om Sham Shanaischaraya Namaha\nNilanjana Samabhasam\nRavi Putram Yamagrajam\nChaya Martanda Sambhutam",
        textHindi: "ॐ शं शनैश्चराय नमः\nनीलांजन समाभासं\nरवि पुत्रं यमाग्रजम्\nछाया मार्तण्ड संभूतम्",
        translation: "I bow to Lord Shani, who appears like blue ointment, son of Sun god, elder brother of Yama, born from shadow and sun.",
        deity: "Shani",
        emojiCounts: { "🙏": 35, "❤️": 20, "🌟": 28 }
      },
      {
        id: "sat-2",
        day: "Saturday",
        category: "Stotrams",
        title: "Shani Stotra",
        textEnglish: "Konastha Pingalo Babhrur\nKrishnango Raudro Antako\nYama Souri Shani Krurah\nPippaladenasutah Priyah",
        textHindi: "कोणस्थ पिंगलो बभ्रुः\nकृष्णांगो रौद्रो अन्तकः\nयमः सौरिः शनिः क्रूरः\nपिप्पलादेनसुतः प्रियः",
        translation: "Dwelling in corners, tawny, reddish-brown, dark-bodied, fierce destroyer, Yama, son of Sun, Shani the stern, dear son of sage Pippalada.",
        deity: "Shani",
        emojiCounts: { "🙏": 25, "❤️": 15, "🌟": 20 }
      },

      // SATURDAY - Shani Dev Worship
      {
        id: "sat-1",
        day: "Saturday",
        category: "Mantras",
        title: "Shani Mantra",
        textEnglish: "Om Sham Shanaischaraya Namaha\nNilanjana Samabhasam\nRavi Putram Yamagrajam\nChaya Martanda Sambhutam",
        textHindi: "ॐ शं शनैश्चराय नमः\nनीलांजन समाभासं\nरवि पुत्रं यमाग्रजम्\nछाया मार्तण्ड संभूतम्",
        translation: "I bow to Lord Shani, who appears like blue ointment, son of Sun god, elder brother of Yama, born from shadow and sun.",
        deity: "Shani",
        emojiCounts: { "🙏": 35, "❤️": 20, "🌟": 28 }
      },
      {
        id: "sat-2",
        day: "Saturday",
        category: "Stotrams",
        title: "Shani Stotra",
        textEnglish: "Konastha Pingalo Babhrur\nKrishnango Raudro Antako\nYama Souri Shani Krurah\nPippaladenasutah Priyah",
        textHindi: "कोणस्थ पिंगलो बभ्रुः\nकृष्णांगो रौद्रो अन्तकः\nयमः सौरिः शनिः क्रूरः\nपिप्पलादेनसुतः प्रियः",
        translation: "Dwelling in corners, tawny, reddish-brown, dark-bodied, fierce destroyer, Yama, son of Sun, Shani the stern, dear son of sage Pippalada.",
        deity: "Shani",
        emojiCounts: { "🙏": 25, "❤️": 15, "🌟": 20 }
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

  async getContentById(id: string): Promise<Content | undefined> {
    return this.contents.get(id);
  }

  async updateContentReaction(contentId: string, emoji: string): Promise<Content | undefined> {
    const content = this.contents.get(contentId);
    if (!content) return undefined;

    content.emojiCounts[emoji] = (content.emojiCounts[emoji] || 0) + 1;
    this.contents.set(contentId, content);
    return content;
  }

  async getCategoriesByDay(day: string): Promise<string[]> {
    const dayContents = await this.getContentByDay(day);
    const categories = [...new Set(dayContents.map(content => content.category))];
    return categories.sort();
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
