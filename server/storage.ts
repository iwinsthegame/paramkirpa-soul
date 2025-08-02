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

      // MONDAY - Lord Shiva Worship (Complete Categories)
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
        id: "mon-1b",
        day: "Monday",
        category: "Mantras",
        title: "Om Namah Shivaya",
        textEnglish: "Om Namah Shivaya\nOm Namah Shivaya\nOm Namah Shivaya\nOm Namah Shivaya",
        textHindi: "ॐ नमः शिवाय\nॐ नमः शिवाय\nॐ नमः शिवाय\nॐ नमः शिवाय",
        translation: "I bow to Lord Shiva, the auspicious one, the destroyer of ignorance and evil.",
        deity: "Shiva",
        emojiCounts: { "🙏": 45, "❤️": 30, "🌟": 38 }
      },
      {
        id: "mon-1c",
        day: "Monday",
        category: "Mantras",
        title: "Shiva Gayatri Mantra",
        textEnglish: "Om Tatpurushaya Vidmahe\nMahadevaya Dhimahi\nTanno Rudrah Prachodayat",
        textHindi: "ॐ तत्पुरुषाय विदमहे\nमहादेवाय धीमहि\nतन्नो रुद्रः प्रचोदयात्",
        translation: "We know the great Purusha, we meditate on Mahadeva, may that Rudra inspire our understanding.",
        deity: "Shiva",
        emojiCounts: { "🙏": 28, "❤️": 18, "🌟": 22 }
      },
      {
        id: "mon-2",
        day: "Monday",
        category: "Chalisas",
        title: "Shiv Chalisa",
        textEnglish: "Jai Girijapati Hridaya Harasha\nMatadamber Mana Kiye Prakasha\nRatna Jatit Shish Phani Rajit\nKshana Kshana Anand Adhik Sajit\n\nBhuj Chaturbhuj Ur Mani Maala\nKar Trishul Sobhit Bhaala\nSur Nara Muni Jan Sewat Taahi\nJag Janani Kripala Man Mahi",
        textHindi: "जै गिरिजापति हृदय हर्ष\nमातदम्बर मन कीये प्रकाश\nरत्न जटित शीश फणि राजित\nक्षण क्षण आनंद अधिक साजित\n\nभुज चतुर्भुज उर मणि माला\nकर त्रिशूल शोभित भाला\nसुर नर मुनि जन सेवत ताही\nजग जननि कृपाल मन माही",
        translation: "Hail to Lord of Parvati, joy of the heart, illuminating the mind like a mother's embrace, adorned with jewels in his matted hair with serpents, ever increasing in bliss moment by moment. Four-armed, with gem necklace on chest, trident in hand and glowing forehead, served by gods, humans and sages, the compassionate mother of the universe in the heart.",
        deity: "Shiva",
        emojiCounts: { "🙏": 35, "❤️": 25, "🌟": 28 }
      },
      {
        id: "mon-3",
        day: "Monday",
        category: "Aartis",
        title: "Om Jai Shiv Omkara",
        textEnglish: "Om Jai Shiv Omkara\nSwami Jai Shiv Omkara\nBrahma Vishnu Sadashiv\nArddhangee Dhara\nOm Jai Shiv Omkara\n\nEkanan Chaturanan Panchanan Rajai\nHansanan Garudasan Vrishvahan Sajai\nDo Bhuj Char Chaturbhuj Dus Bhuj Te Sohai\nTribhuvan Mein Ek Roop Hai Yahee Mohai",
        textHindi: "ॐ जय शिव ओंकारा\nस्वामी जय शिव ओंकारा\nब्रह्मा विष्णु सदाशिव\nअर्धांगी धारा\nॐ जय शिव ओंकारा\n\nएकानन चतुरानन पंचानन राजै\nहंसानन गरुड़ासन वृषवाहन साजै\nदो भुज चार चतुर्भुज दस भुज ते सोहै\nत्रिभुवन में एक रूप है यही मोहै",
        translation: "Victory to Lord Shiva, the embodiment of Om! Lord, victory to Shiva Om! Brahma, Vishnu, and eternal Shiva, the one who has Parvati as half his body. With one face, four faces, five faces they shine, with swan mount, eagle mount, bull mount they are adorned. With two arms, four arms, ten arms they appear beautiful, in the three worlds, this one form enchants all.",
        deity: "Shiva",
        emojiCounts: { "🙏": 42, "❤️": 32, "🌟": 38 }
      },
      {
        id: "mon-4",
        day: "Monday",
        category: "Kathas",
        title: "Somvar Vrat Katha",
        textEnglish: "Long ago, there lived a poor Brahmin who observed Somvar (Monday) fasting with great devotion. Every Monday, he would fast, visit the Shiva temple, and offer water to the Shivlinga with pure heart.\n\nOne Monday, while returning from the temple, he found a bag of gold coins. He thought, 'This must be someone's lost property.' Instead of keeping it, he announced loudly, 'If anyone has lost a bag of gold coins, please come and take it.'\n\nA wealthy merchant heard this and falsely claimed the bag, even though it wasn't his. The honest Brahmin gave it to him without question. Lord Shiva, pleased with the Brahmin's honesty and devotion, blessed him with immense wealth and prosperity.\n\nThis story teaches us that honest devotion to Lord Shiva on Mondays brings divine blessings and removes all obstacles from life.",
        textHindi: "बहुत समय पहले एक गरीब ब्राह्मण रहता था जो सोमवार का व्रत बड़ी श्रद्धा से करता था। हर सोमवार को वह उपवास करता, शिव मंदिर जाता, और शुद्ध मन से शिवलिंग पर जल चढ़ाता था।\n\nएक सोमवार को मंदिर से लौटते समय उसे सोने के सिक्कों की एक थैली मिली। उसने सोचा, 'यह किसी की खोई हुई संपत्ति होगी।' इसे रखने के बजाय, उसने जोर से घोषणा की, 'यदि किसी के सोने के सिक्कों की थैली खो गई है, तो आकर ले जाए।'\n\nएक धनी व्यापारी ने यह सुना और झूठा दावा किया, हालांकि वह उसकी नहीं थी। ईमानदार ब्राह्मण ने बिना सवाल पूछे उसे दे दी। भगवान शिव, ब्राह्मण की ईमानदारी और भक्ति से प्रसन्न होकर, उसे अपार धन और समृद्धि का आशीर्वाद दिया।\n\nयह कहानी हमें सिखाती है कि सोमवार को भगवान शिव की ईमानदार भक्ति दैवीय आशीर्वाद लाती है और जीवन से सभी बाधाओं को दूर करती है।",
        translation: "The story of how sincere Monday fasting and devotion to Lord Shiva brings divine blessings and prosperity to devotees.",
        deity: "Shiva",
        emojiCounts: { "🙏": 25, "❤️": 20, "🌟": 18 }
      },
      {
        id: "mon-5",
        day: "Monday",
        category: "Stotrams",
        title: "Shiva Tandava Stotram",
        textEnglish: "Jata Kata Ha Sambhramah Bhraman Nilimpanirjhari\nVilola Veechi Vallari Viraja Mana Murdhani\nDhaga Dhaga Dhajjvalanala Lalata Patta Pavake\nKishora Chandra Shekhareh Ratih Pratikshanam Mama\n\nDharadharendranandini Vilasa Bandhuvabdhute\nSphuradigantasantatipramo Doddhadagujjvale\nKrupalakatarakshabhramad Bhrukshepa Bhajyake\nDahadadahadahaha Dhadana Nilimpa Nirjhari",
        textHindi: "जटा कटा ह सम्भ्रमन्ह भ्रमन्निलिम्पनिर्झरी\nविलोलवीचिवल्लरी विराजमानमूर्धानि\nधगद्धगद्धगज्ज्वलल्ललाटपट्टपावके\nकिशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम\n\nधराधरेन्द्रनन्दिनी विलासबन्धुवन्धुते\nस्फुरदिगन्तसन्ततिप्रमोद्दामगुज्ज्वले\nकृपाकटाक्षधोरणी निरुद्धदुर्धरापदि\nक्वचिद्दिगम्बरे मनो विनोदमेतुतस्तव",
        translation: "In whose matted locks the Ganges river flows turbulently with its rushing waters, whose forehead blazes with fire, who wears the crescent moon as his crown - in him my delight increases every moment. The daughter of the mountain king (Parvati) sports with him, whose brilliant radiance spreads across all directions.",
        deity: "Shiva",
        emojiCounts: { "🙏": 55, "❤️": 45, "🌟": 50 }
      },
      {
        id: "mon-6",
        day: "Monday",
        category: "Vrat Vidhi",
        title: "Somvar Vrat Vidhi",
        textEnglish: "SOMVAR VRAT PROCEDURE:\n\n1. Wake up before sunrise and take a holy bath\n2. Wear clean white or light-colored clothes\n3. Visit Shiva temple or set up home altar\n4. Offer water, milk, and Bilva leaves to Shivlinga\n5. Light a diya (lamp) with ghee or oil\n6. Chant 'Om Namah Shivaya' 108 times\n7. Read or listen to Shiva stories/katha\n8. Observe complete fast or eat only fruits\n9. Avoid grains, salt, and cooked food\n10. Break fast after evening Shiva aarti\n11. Donate white items like milk, rice, or cloth\n12. Maintain celibacy and speak truth\n\nBENEFITS: Removes obstacles, grants good health, brings prosperity, and fulfills desires.",
        textHindi: "सोमवार व्रत विधि:\n\n१. सूर्योदय से पहले उठकर पवित्र स्नान करें\n२. स्वच्छ सफेद या हल्के रंग के वस्त्र धारण करें\n३. शिव मंदिर जाएं या घर में वेदी सजाएं\n४. शिवलिंग पर जल, दूध और बिल्वपत्र चढ़ाएं\n५. घी या तेल का दीपक जलाएं\n६. 'ॐ नमः शिवाय' का १०८ बार जाप करें\n७. शिव कथा पढ़ें या सुनें\n८. पूर्ण उपवास रखें या केवल फल लें\n९. अनाज, नमक और पका हुआ भोजन त्यागें\n१०. संध्या आरती के बाद व्रत तोड़ें\n११. दूध, चावल या कपड़े जैसी सफेद वस्तुओं का दान करें\n१२. ब्रह्मचर्य का पालन करें और सत्य बोलें\n\nलाभ: बाधाओं का नाश, अच्छा स्वास्थ्य, समृद्धि और मनोकामना पूर्ति।",
        translation: "Complete procedure for observing Monday fast dedicated to Lord Shiva for spiritual and material benefits.",
        deity: "Shiva",
        emojiCounts: { "🙏": 40, "❤️": 30, "🌟": 35 }
      },
      {
        id: "mon-7",
        day: "Monday",
        category: "Extras",
        title: "Rudraksha Importance",
        textEnglish: "RUDRAKSHA - THE SACRED BEADS\n\nRudraksha beads are sacred seeds that grow on Rudraksha trees, primarily found in Nepal and India. They hold immense spiritual significance in Hinduism.\n\nORIGIN: According to scriptures, when Lord Shiva meditated for the welfare of all living beings, tears of compassion fell from his eyes. These tears became Rudraksha trees.\n\nBENEFITS:\n• Provides mental peace and reduces stress\n• Enhances concentration during meditation\n• Protects from negative energies\n• Improves blood circulation and heart health\n• Brings clarity of thought and wisdom\n• Strengthens spiritual connection with Lord Shiva\n\nTYPES: Rudraksha beads range from 1 to 21 faces (mukhi), each having specific benefits:\n• 1 Mukhi: Enlightenment and connection to Lord Shiva\n• 5 Mukhi: Most common, represents Lord Shiva himself\n• 6 Mukhi: Wisdom and learning\n• 11 Mukhi: Courage and fearlessness\n\nWEARING: Should be worn after proper energization and with devotion to Lord Shiva.",
        textHindi: "रुद्राक्ष - पवित्र मणके\n\nरुद्राक्ष पवित्र बीज हैं जो रुद्राक्ष के पेड़ों पर उगते हैं, मुख्यतः नेपाल और भारत में पाए जाते हैं। हिंदू धर्म में इनका अत्यधिक आध्यात्मिक महत्व है।\n\nउत्पत्ति: शास्त्रों के अनुसार, जब भगवान शिव ने सभी जीवों के कल्याण के लिए ध्यान किया, तो उनकी आंखों से करुणा के आंसू गिरे। ये आंसू रुद्राक्ष के पेड़ बन गए।\n\nलाभ:\n• मानसिक शांति प्रदान करता है और तनाव कम करता है\n• ध्यान के दौरान एकाग्रता बढ़ाता है\n• नकारात्मक ऊर्जाओं से सुरक्षा करता है\n• रक्त परिसंचरण और हृदय स्वास्थ्य में सुधार\n• विचारों की स्पष्टता और बुद्धि लाता है\n• भगवान शिव के साथ आध्यात्मिक जुड़ाव मजबूत करता है\n\nप्रकार: रुद्राक्ष के दाने १ से २१ मुखी तक होते हैं, प्रत्येक के विशिष्ट लाभ हैं:\n• १ मुखी: ज्ञान और भगवान शिव से जुड़ाव\n• ५ मुखी: सबसे आम, स्वयं भगवान शिव का प्रतिनिधित्व\n• ६ मुखी: बुद्धि और विद्या\n• ११ मुखी: साहस और निर्भयता\n\nधारण: उचित ऊर्जीकरण के बाद और भगवान शिव की भक्ति के साथ धारण करना चाहिए।",
        translation: "Complete guide to Rudraksha beads, their spiritual significance, benefits, and proper usage for Shiva devotees.",
        deity: "Shiva",
        emojiCounts: { "🙏": 35, "❤️": 25, "🌟": 30 }
      },
      {
        id: "mon-8",
        day: "Monday",
        category: "Extras",
        title: "Bilva Patra Pujan",
        textEnglish: "BILVA PATRA (BAEL LEAVES) WORSHIP\n\nBilva Patra, the sacred three-leafed Bael tree leaves, are extremely dear to Lord Shiva. Offering them brings immense blessings.\n\nSIGNIFICANCE:\n• The three leaves represent the three gunas (Sattva, Rajas, Tamas)\n• They symbolize the three eyes of Lord Shiva\n• Represent the trinity of Brahma, Vishnu, and Shiva\n• The trifoliate structure represents past, present, and future\n\nBENEFITS OF OFFERING BILVA PATRA:\n• Removes sins of three lifetimes\n• Grants moksha (liberation) to devotees\n• Fulfills all desires when offered with devotion\n• Protects from evil spirits and negative forces\n• Brings peace, prosperity, and good health\n• Purifies the mind and soul\n\nPROPER METHOD:\n1. Pluck fresh Bilva leaves in the morning\n2. Choose leaves without holes or damage\n3. Wash them with clean water\n4. Offer them to Shivlinga while chanting mantras\n5. Place them gently on the Shivlinga\n6. Offer with 'Om Namah Shivaya' chant\n\nMANTRA: 'Tridalam Trigunakaram Trinayatram Triyayusham, Trijanma Papa Samharam Eka Bilva Patram Shivarpitam'\n\nEven a single Bilva leaf offered with pure devotion pleases Lord Shiva immensely.",
        textHindi: "बिल्व पत्र पूजन\n\nबिल्व पत्र, पवित्र तीन पत्तियों वाले बेल वृक्ष के पत्ते, भगवान शिव को अत्यधिक प्रिय हैं। इन्हें अर्पित करने से अपार आशीर्वाद मिलता है।\n\nमहत्व:\n• तीन पत्तियां तीन गुणों (सत्व, रजस्, तमस्) का प्रतिनिधित्व करती हैं\n• ये भगवान शिव की तीन आंखों का प्रतीक हैं\n• ब्रह्मा, विष्णु और शिव की त्रिमूर्ति का प्रतिनिधित्व\n• त्रिपत्र संरचना भूत, वर्तमान और भविष्य का प्रतीक है\n\nबिल्व पत्र अर्पित करने के लाभ:\n• तीन जन्मों के पापों का नाश\n• भक्तों को मोक्ष की प्राप्ति\n• श्रद्धा से अर्पित करने पर सभी मनोकामनाएं पूर्ण\n• दुष्ट आत्माओं और नकारात्मक शक्तियों से सुरक्षा\n• शांति, समृद्धि और अच्छे स्वास्थ्य की प्राप्ति\n• मन और आत्मा की शुद्धता\n\nउचित विधि:\n१. सुबह ताजे बिल्व पत्र तोड़ें\n२. बिना छेद या क्षति वाले पत्ते चुनें\n३. उन्हें स्वच्छ जल से धोएं\n४. मंत्र जाप करते हुए शिवलिंग पर अर्पित करें\n५. उन्हें धीरे से शिवलिंग पर रखें\n६. 'ॐ नमः शिवाय' का जाप करते हुए अर्पित करें\n\nमंत्र: 'त्रिदलं त्रिगुणाकारं त्रिनेत्रं त्रियायुषम्, त्रिजन्म पाप संहारम् एक बिल्व पत्रम् शिवार्पितम्'\n\nशुद्ध भक्ति से अर्पित किया गया एक भी बिल्व पत्र भगवान शिव को अत्यधिक प्रसन्न करता है।",
        translation: "Complete guide to the sacred Bilva Patra worship, its spiritual significance, and proper offering methods to please Lord Shiva.",
        deity: "Shiva",
        emojiCounts: { "🙏": 32, "❤️": 28, "🌟": 25 }
      },

      // TUESDAY - Lord Hanuman Worship (Complete Categories)
      {
        id: "tue-1",
        day: "Tuesday",
        category: "Mantras",
        title: "Hanuman Beej Mantra",
        textEnglish: "Om Namo Hanumate Namah\nOm Namo Hanumate Namah\nOm Namo Hanumate Namah\nOm Namo Hanumate Namah",
        textHindi: "ॐ नमो हनुमते नमः\nॐ नमो हनुमते नमः\nॐ नमो हनुमते नमः\nॐ नमो हनुमते नमः",
        translation: "I bow to Lord Hanuman, the mighty devotee of Lord Rama, who grants strength and courage.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 50, "❤️": 35, "🌟": 45 }
      },
      {
        id: "tue-1b",
        day: "Tuesday",
        category: "Mantras",
        title: "Hanuman Gayatri Mantra",
        textEnglish: "Om Anjaneyaya Vidmahe\nVayuputraya Dhimahi\nTanno Hanuman Prachodayat",
        textHindi: "ॐ अञ्जनेयाय विदमहे\nवायुपुत्राय धीमहि\nतन्नो हनुमान् प्रचोदयात्",
        translation: "We meditate on the son of Anjana, we contemplate on the son of the Wind God, may that Hanuman inspire us.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 40, "❤️": 28, "🌟": 35 }
      },
      {
        id: "tue-2",
        day: "Tuesday",
        category: "Chalisas",
        title: "Hanuman Chalisa",
        textEnglish: "Shree Guru Charan Saroj Raj\nNij Manu Mukuru Sudhari\nBarnau Raghuvar Bimal Jasu\nJo Dayaku Phal Chari\n\nBuddhi Heen Tanu Janike\nSumirau Pavan Kumar\nBal Buddhi Vidya Dehu Mohi\nHarahu Kalesa Vikar",
        textHindi: "श्रीगुरु चरण सरोज रज\nनिज मनु मुकुरु सुधारि\nबरनऊँ रघुबर बिमल जसु\nजो दायकु फल चारि\n\nबुद्धिहीन तनु जानिके\nसुमिरौं पवन-कुमार\nबल बुद्धि विद्या देहु मोहि\nहरहु कलेश बिकार",
        translation: "With the dust of my Guru's lotus feet, I cleanse the mirror of my mind and describe the pure fame of Raghuvir, which bestows the four fruits of life. Knowing myself to be ignorant, I remember you, Son of the Wind. Grant me strength, wisdom and knowledge, and remove my afflictions and impurities.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 60, "❤️": 45, "🌟": 55 }
      },
      {
        id: "tue-3",
        day: "Tuesday",
        category: "Aartis",
        title: "Aarti Kije Hanuman Lala Ki",
        textEnglish: "Aarti Kije Hanuman Lala Ki\nDushtdalan Raghunath Kala Ki\nJake Bal Se Girivar Kaanpe\nRog Dosh Jaki Nimesh Mein Jaanpe\n\nAnjani Putra Maha Baladata\nSantan Ke Prabhu Sadaa Sahayadata\nDe Vira Rasa Raghunath Gune Gaavo\nSankat Se Hanuman Chhudaavo",
        textHindi: "आरती कीजै हनुमान लला की\nदुष्टदलन रघुनाथ कला की\nजाके बल से गिरिवर काँपे\nरोग दोष जाकी निमेष में जाँपे\n\nअंजनी पुत्र महा बलदाता\nसंतन के प्रभु सदा सहायदाता\nदे वीरा रसा रघुनाथ गुणे गावो\nसंकट से हनुमान छुड़ावो",
        translation: "We perform aarti of beloved Hanuman, the destroyer of evil and manifestation of Lord Rama's power. By whose strength mountains tremble, whose presence removes diseases and afflictions in an instant. Son of Anjani, great giver of strength, eternal helper of devotees, give us courage to sing Rama's virtues and free us from troubles, O Hanuman.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 45, "❤️": 38, "🌟": 42 }
      },
      {
        id: "tue-4",
        day: "Tuesday",
        category: "Kathas",
        title: "Mangalvar Vrat Katha",
        textEnglish: "There once lived a wealthy merchant who had lost all his fortune due to bad business decisions. His family was struggling with poverty and despair. His wife suggested observing the Tuesday fast (Mangalvar Vrat) dedicated to Lord Hanuman.\n\nEvery Tuesday, the merchant would fast, visit the Hanuman temple, and offer red flowers and sindoor to the deity. He would recite the Hanuman Chalisa with complete devotion and distribute prasad to the needy.\n\nAfter several months of sincere devotion, Lord Hanuman was pleased with his dedication. One Tuesday, while returning from the temple, the merchant found a rare gem on the road. When he sold it, he received enough money to restart his business.\n\nWithin a year, his business flourished beyond his expectations. The merchant realized that Lord Hanuman's blessings had transformed his life. He continued the Tuesday fasting tradition and lived prosperously ever after.\n\nThis story teaches us that sincere devotion to Lord Hanuman on Tuesdays brings strength, courage, and prosperity to overcome all difficulties in life.",
        textHindi: "एक समय एक धनी व्यापारी रहता था जिसने गलत व्यापारिक निर्णयों के कारण अपनी सारी संपत्ति खो दी थी। उसका परिवार गरीबी और निराशा से जूझ रहा था। उसकी पत्नी ने सुझाव दिया कि वे भगवान हनुमान को समर्पित मंगलवार का व्रत करें।\n\nहर मंगलवार को व्यापारी उपवास करता, हनुमान मंदिर जाता, और देवता को लाल फूल और सिंदूर चढ़ाता। वह पूर्ण भक्ति से हनुमान चालीसा का पाठ करता और जरूरतमंदों में प्रसाद बांटता।\n\nकई महीनों की सच्ची भक्ति के बाद, भगवान हनुमान उसकी निष्ठा से प्रसन्न हुए। एक मंगलवार को मंदिर से लौटते समय व्यापारी को रास्ते में एक दुर्लभ रत्न मिला। जब उसने इसे बेचा तो उसे अपना व्यापार फिर से शुरू करने के लिए पर्याप्त पैसा मिला।\n\nएक साल के भीतर उसका व्यापार उसकी अपेक्षाओं से कहीं अधिक फला-फूला। व्यापारी को एहसास हुआ कि भगवान हनुमान के आशीर्वाद ने उसका जीवन बदल दिया है। उसने मंगलवार के उपवास की परंपरा जारी रखी और समृद्धि से जीवन बिताया।\n\nयह कहानी हमें सिखाती है कि मंगलवार को भगवान हनुमान की सच्ची भक्ति जीवन की सभी कठिनाइयों पर काबू पाने के लिए शक्ति, साहस और समृद्धि लाती है।",
        translation: "The story of how Tuesday fasting and devotion to Lord Hanuman brings strength, courage, and prosperity to overcome life's challenges.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 30, "❤️": 25, "🌟": 28 }
      },
      {
        id: "tue-5",
        day: "Tuesday",
        category: "Stotrams",
        title: "Bajrang Baan",
        textEnglish: "Nirvighnam Kuru Me Deva\nSarva Karyeshu Sarvada\nNityam Bramhacharya Dehi\nVidyam Dehi Yasho Dehi\n\nShatru Budhi Vinashaya\nSarva Sampat Pradayaka\nSarva Mantra Swarupaya\nSarva Yantra Viduttama",
        textHindi: "निर्विघ्नं कुरु मे देव\nसर्व कार्येषु सर्वदा\nनित्यं ब्रह्मचर्य देहि\nविद्यां देहि यशो देहि\n\nशत्रु बुद्धि विनाशाय\nसर्व संपत् प्रदायक\nसर्व मंत्र स्वरूपाय\nसर्व यंत्र विदुत्तम",
        translation: "Remove all obstacles from my path, O Lord, in all my endeavors always. Grant me eternal celibacy, knowledge, and fame. Destroy the enemy's intellect, O giver of all prosperity, you who are the embodiment of all mantras and the best among all yantras.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 65, "❤️": 50, "🌟": 60 }
      },
      {
        id: "tue-6",
        day: "Tuesday",
        category: "Vrat Vidhi",
        title: "Mangalvar Vrat Vidhi",
        textEnglish: "TUESDAY FAST PROCEDURE:\n\n1. Wake up early and take a bath\n2. Wear red or orange colored clothes\n3. Visit Hanuman temple or set up home altar\n4. Offer red flowers, sindoor, and laddoos\n5. Light a diya with mustard oil\n6. Recite Hanuman Chalisa 7 times\n7. Chant 'Om Namo Hanumate Namah' 108 times\n8. Fast completely or eat only fruits\n9. Avoid grains, salt, and cooked meals\n10. Break fast after sunset with prasad\n11. Distribute laddoos to devotees\n12. Read Bajrang Baan for protection\n\nBENEFITS: Grants strength, courage, removes obstacles, protects from enemies, and brings success.",
        textHindi: "मंगलवार व्रत विधि:\n\n१. सुबह जल्दी उठकर स्नान करें\n२. लाल या नारंगी रंग के वस्त्र धारण करें\n३. हनुमान मंदिर जाएं या घर में वेदी सजाएं\n४. लाल फूल, सिंदूर और लड्डू चढ़ाएं\n५. सरसों के तेल का दीपक जलाएं\n६. हनुमान चालीसा का ७ बार पाठ करें\n७. 'ॐ नमो हनुमते नमः' का १०८ बार जाप करें\n८. पूर्ण उपवास रखें या केवल फल लें\n९. अनाज, नमक और पका हुआ भोजन त्यागें\n१०. सूर्यास्त के बाद प्रसाद से व्रत तोड़ें\n११. भक्तों में लड्डू बांटें\n१२. सुरक्षा के लिए बजरंग बाण का पाठ करें\n\nलाभ: शक्ति, साहस प्रदान करता है, बाधाओं को दूर करता है, शत्रुओं से सुरक्षा और सफलता दिलाता है।",
        translation: "Complete procedure for observing Tuesday fast dedicated to Lord Hanuman for strength and protection.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 45, "❤️": 35, "🌟": 40 }
      },
      {
        id: "tue-7",
        day: "Tuesday",
        category: "Extras",
        title: "Importance of Sindoor",
        textEnglish: "SINDOOR - THE SACRED VERMILLION\n\nSindoor (vermillion) holds special significance in Hanuman worship and Hindu traditions.\n\nSIGNIFICANCE IN HANUMAN WORSHIP:\n• Lord Hanuman loves sindoor as it represents devotion and surrender\n• Offering sindoor grants strength, courage, and protection\n• Red color symbolizes energy, power, and divine blessing\n• Hanuman applied sindoor all over his body to please Sita Mata\n\nSPIRITUAL BENEFITS:\n• Removes negative energies and evil eye\n• Provides protection from enemies and obstacles\n• Enhances courage and fearlessness\n• Brings prosperity and good fortune\n• Strengthens devotion and faith\n\nHOW TO OFFER:\n1. Apply sindoor on Hanuman's forehead and body\n2. Chant Hanuman mantras while offering\n3. Apply a small tilak on your own forehead\n4. Distribute sindoor prasad to devotees\n\nSCRIPTURAL REFERENCE:\nWhen Sita Mata applied sindoor on her forehead for Rama's long life, Hanuman thought if a little sindoor brings such blessings, then applying it all over would bring even greater blessings. This devotional act pleased both Rama and Sita immensely.\n\nOffering sindoor to Hanuman on Tuesdays is considered especially auspicious and fulfills all desires.",
        textHindi: "सिंदूर - पवित्र सिन्दूर\n\nसिंदूर का हनुमान पूजा और हिंदू परंपराओं में विशेष महत्व है।\n\nहनुमान पूजा में महत्व:\n• भगवान हनुमान सिंदूर से प्रेम करते हैं क्योंकि यह भक्ति और समर्पण का प्रतीक है\n• सिंदूर चढ़ाने से शक्ति, साहस और सुरक्षा मिलती है\n• लाल रंग ऊर्जा, शक्ति और दिव्य आशीर्वाद का प्रतीक है\n• हनुमान जी ने सीता माता को प्रसन्न करने के लिए पूरे शरीर पर सिंदूर लगाया था\n\nआध्यात्मिक लाभ:\n• नकारात्मक ऊर्जाओं और बुरी नजर को हटाता है\n• शत्रुओं और बाधाओं से सुरक्षा प्रदान करता है\n• साहस और निर्भयता बढ़ाता है\n• समृद्धि और सौभाग्य लाता है\n• भक्ति और विश्वास को मजबूत करता है\n\nअर्पित करने की विधि:\n१. हनुमान जी के मस्तक और शरीर पर सिंदूर लगाएं\n२. सिंदूर चढ़ाते समय हनुमान मंत्र का जाप करें\n३. अपने मस्तक पर छोटा सा तिलक लगाएं\n४. भक्तों में सिंदूर प्रसाद बांटें\n\nशास्त्रीय संदर्भ:\nजब सीता माता ने राम जी की दीर्घायु के लिए अपने मस्तक पर सिंदूर लगाया, तो हनुमान जी ने सोचा कि यदि थोड़ा सा सिंदूर इतना आशीर्वाद देता है, तो पूरे शरीर पर लगाने से और भी अधिक आशीर्वाद मिलेगा। इस भक्ति भाव से राम और सीता दोनों अत्यंत प्रसन्न हुए।\n\nमंगलवार को हनुमान जी को सिंदूर चढ़ाना विशेष रूप से शुभ माना जाता है और सभी मनोकामनाओं को पूर्ण करता है।",
        translation: "Complete guide to the sacred significance of sindoor in Hanuman worship and its spiritual benefits.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 38, "❤️": 30, "🌟": 35 }
      },
      {
        id: "tue-8",
        day: "Tuesday",
        category: "Extras",
        title: "Laddoo Prasad Significance",
        textEnglish: "LADDOO - HANUMAN'S FAVORITE PRASAD\n\nLaddoos are Lord Hanuman's most beloved offering and hold deep spiritual significance.\n\nWHY HANUMAN LOVES LADDOOS:\n• Round shape represents completeness and divine perfection\n• Sweet taste symbolizes the sweetness of devotion\n• Made with pure ingredients like ghee, flour, and jaggery\n• Represents the concentrated energy needed for spiritual practices\n• Associated with strength, as Hanuman is the embodiment of power\n\nSPIRITUAL SIGNIFICANCE:\n• Offering laddoos shows our pure love and devotion\n• Receiving laddoo prasad purifies mind and body\n• Eating with faith removes sins and negative karma\n• Distributing laddoos spreads divine blessings\n• Brings unity among devotees through shared prasad\n\nTYPES OF LADDOOS FOR HANUMAN:\n• Besan (gram flour) laddoos - most traditional\n• Motichoor laddoos - fine, delicate texture\n• Til (sesame) laddoos - especially on Tuesdays\n• Coconut laddoos - pure and sattvic\n• Dry fruit laddoos - rich in nutrients\n\nPROPER OFFERING METHOD:\n1. Prepare or buy fresh laddoos with pure intentions\n2. Place them beautifully before Hanuman's image\n3. Chant Hanuman mantras while offering\n4. Pray for strength, courage, and devotion\n5. Distribute prasad to family and devotees\n6. Eat with gratitude and faith\n\nBENEFITS:\n• Grants physical and mental strength\n• Removes obstacles and fears\n• Brings prosperity and success\n• Enhances devotional feelings\n• Creates positive energy in the environment\n\nTradition says that offering 5, 7, or 11 laddoos to Hanuman on Tuesdays fulfills all wishes and provides divine protection.",
        textHindi: "लड्डू - हनुमान जी का प्रिय प्रसाद\n\nलड्डू भगवान हनुमान का सबसे प्रिय प्रसाद है और इसका गहरा आध्यात्मिक महत्व है।\n\nहनुमान जी को लड्डू क्यों प्रिय है:\n• गोल आकार पूर्णता और दिव्य सिद्धता का प्रतीक है\n• मिठास भक्ति की मधुरता का प्रतीक है\n• घी, आटा और गुड़ जैसी शुद्ध सामग्री से बना\n• आध्यात्मिक साधनाओं के लिए आवश्यक संकेंद्रित ऊर्जा का प्रतिनिधित्व\n• शक्ति से जुड़ा है, क्योंकि हनुमान शक्ति के अवतार हैं\n\nआध्यात्मिक महत्व:\n• लड्डू चढ़ाना हमारे शुद्ध प्रेम और भक्ति को दर्शाता है\n• लड्डू प्रसाद ग्रहण करने से मन और शरीर शुद्ध होता है\n• श्रद्धा से खाने पर पाप और नकारात्मक कर्म दूर होते हैं\n• लड्डू बांटने से दिव्य आशीर्वाद फैलता है\n• साझा प्रसाद के माध्यम से भक्तों में एकता आती है\n\nहनुमान जी के लिए लड्डू के प्रकार:\n• बेसन के लड्डू - सबसे पारंपरिक\n• मोतीचूर के लड्डू - बारीक, नाजुक बनावट\n• तिल के लड्डू - विशेषकर मंगलवार को\n• नारियल के लड्डू - शुद्ध और सात्विक\n• सूखे मेवों के लड्डू - पोषक तत्वों से भरपूर\n\nउचित अर्पण विधि:\n१. शुद्ध भावना से ताजे लड्डू तैयार करें या खरीदें\n२. उन्हें हनुमान जी की मूर्ति के सामने सुंदर तरीके से रखें\n३. अर्पित करते समय हनुमान मंत्र जाप करें\n४. शक्ति, साहस और भक्ति के लिए प्रार्थना करें\n५. परिवार और भक्तों में प्रसाद बांटें\n६. कृतज्ञता और श्रद्धा से ग्रहण करें\n\nलाभ:\n• शारीरिक और मानसिक शक्ति प्रदान करता है\n• बाधाओं और भय को दूर करता है\n• समृद्धि और सफलता लाता है\n• भक्ति भावना बढ़ाता है\n• वातावरण में सकारात्मक ऊर्जा का संचार करता है\n\nपरंपरा कहती है कि मंगलवार को हनुमान जी को ५, ७ या ११ लड्डू चढ़ाने से सभी इच्छाएं पूर्ण होती हैं और दिव्य सुरक्षा मिलती है।",
        translation: "Complete guide to the significance of laddoo prasad in Hanuman worship and its spiritual benefits.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 42, "❤️": 35, "🌟": 38 }
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
