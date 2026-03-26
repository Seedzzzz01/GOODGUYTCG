export interface BlogSection {
  heading?: string;
  icon?: string;
  paragraphs: string[];
  list?: string[];
  tip?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "beginner" | "history" | "collecting" | "strategy" | "news";
  coverImage: string;
  date: string;
  readTime: number;
  author: string;
  tags: string[];
  sections: BlogSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  // ─── 1. Beginner's Guide ───
  {
    slug: "optcg-beginners-guide",
    title: "คู่มือเริ่มต้นเล่น One Piece Card Game ฉบับสมบูรณ์",
    excerpt: "ทุกอย่างที่มือใหม่ต้องรู้ก่อนเริ่มเล่น OPTCG ตั้งแต่ Leader Card ไปจนถึงวิธีชนะเกม อธิบายง่ายๆ พร้อมตัวอย่าง",
    category: "beginner",
    coverImage: "/images/sections/set-sail.jpg",
    date: "2026-03-20",
    readTime: 12,
    author: "LUCKY TCG THAILAND",
    tags: ["มือใหม่", "วิธีเล่น", "กติกา", "OPTCG"],
    sections: [
      {
        heading: "One Piece Card Game คืออะไร?",
        icon: "🏴‍☠️",
        paragraphs: [
          "One Piece Card Game (OPTCG) คือการ์ดเกมจาก Bandai ที่สร้างจากมังงะ/อนิเมะ One Piece ของ Eiichiro Oda เปิดตัวครั้งแรกที่ญี่ปุ่นในเดือนกรกฎาคม 2022 และวางจำหน่ายเวอร์ชันภาษาอังกฤษในเดือนธันวาคม 2022",
          "เกมนี้เติบโตอย่างรวดเร็วจนกลายเป็นหนึ่งใน TCG ที่เติบโตเร็วที่สุดในประวัติศาสตร์ ด้วยภาพสวยงามของตัวละครจาก One Piece และระบบเกมที่เรียนรู้ง่ายแต่เล่นลึก",
        ],
      },
      {
        heading: "เริ่มเล่นต้องมีอะไร?",
        icon: "🃏",
        paragraphs: [
          "สิ่งที่ต้องมีก่อนเริ่มเล่นคือ Deck (สำรับไพ่) 1 ชุด ซึ่งประกอบด้วย Leader Card 1 ใบ และ Main Deck 50 ใบ พร้อม DON!! Card 10 ใบ",
        ],
        list: [
          "Leader Card (1 ใบ) — ตัวละครหลักของสำรับ กำหนดสี และความสามารถพิเศษ",
          "Main Deck (50 ใบ) — ประกอบด้วย Character, Event และ Stage cards ที่ต้องมีสีตรงกับ Leader",
          "DON!! Cards (10 ใบ) — พลังงานที่ใช้เรียก Character หรือ Boost พลังโจมตี เหมือน Mana ในเกมการ์ดอื่น",
          "Starter Deck — ทางเลือกที่ดีที่สุดสำหรับมือใหม่ มีมาพร้อมเล่นได้เลย",
        ],
        tip: "สำหรับมือใหม่แนะนำซื้อ Starter Deck ก่อน เพราะมาพร้อม Leader + Deck + DON!! ครบชุด เล่นได้ทันที",
      },
      {
        heading: "วิธีเล่นแบบง่ายๆ",
        icon: "⚔️",
        paragraphs: [
          "เป้าหมายของเกมคือโจมตี Leader ฝ่ายตรงข้ามจน Life เหลือ 0 แล้วโจมตีอีกครั้งเพื่อชนะ แต่ละ Leader มี Life 4-5 แต้ม",
        ],
        list: [
          "Phase 1: Refresh — ตั้ง DON!! และ Character ที่พักอยู่ให้ Active",
          "Phase 2: Draw — จั่วการ์ด 1 ใบ",
          "Phase 3: DON!! — เพิ่ม DON!! จาก DON!! Deck 2 ใบ (พลังงานสำหรับเทิร์นนี้)",
          "Phase 4: Main — เล่น Character/Event/Stage โดยจ่าย DON!! ตามค่า Cost",
          "Phase 5: Attack — ใช้ Character หรือ Leader โจมตีฝ่ายตรงข้าม",
          "เมื่อ Leader โดนโจมตี จะเสีย Life 1 แต้ม (จั่วเข้ามือ) ถ้า Life หมดแล้วโดนโจมตีอีกครั้ง = แพ้",
        ],
        tip: "การ์ด Life ที่จั่วเข้ามือสามารถใช้ Trigger Effect ได้ฟรี ดังนั้น Life น้อยไม่ได้หมายความว่าเสียเปรียบเสมอไป!",
      },
      {
        heading: "สินค้ามีกี่ประเภท?",
        icon: "📦",
        paragraphs: [
          "OPTCG มีสินค้าหลายประเภท แต่ละแบบเหมาะกับจุดประสงค์ที่ต่างกัน",
        ],
        list: [
          "Starter Deck (ST) — สำรับพร้อมเล่น เหมาะมือใหม่ มี Leader exclusive",
          "Booster Pack/Box (OP) — ซองสุ่มการ์ด 6 ใบ/ซอง กล่องมี 24 ซอง เปิดลุ้นการ์ดหายาก",
          "Extra Booster (EB) — เซ็ตเสริมพิเศษ จำนวนการ์ดน้อยกว่า Booster ปกติ",
          "Premium Booster (PRB) — ซองพิเศษที่มีโอกาสได้การ์ดหายากสูงกว่าปกติ",
        ],
      },
      {
        heading: "ควรเริ่มซื้ออะไรก่อน?",
        icon: "💰",
        paragraphs: [
          "ถ้าอยากเล่น: ซื้อ Starter Deck ที่ชอบ 1 ชุด แล้วค่อยซื้อ Booster Box เพิ่มเพื่ออัพเกรด Deck",
          "ถ้าอยากสะสม: เริ่มจาก Booster Box เลย เพราะมีการ์ดหลากหลายและมีโอกาสลุ้นการ์ดหายากที่ราคาดี",
        ],
      },
    ],
  },

  // ─── 2. History ───
  {
    slug: "optcg-history-rise-of-tcg",
    title: "ประวัติ One Piece Card Game: จากเปิดตัวสู่ TCG อันดับต้นของโลก",
    excerpt: "ย้อนรอยการเดินทางของ OPTCG ตั้งแต่เปิดตัวปี 2022 จนถึงปัจจุบัน เกมการ์ดที่เติบโตเร็วที่สุดในยุคนี้",
    category: "history",
    coverImage: "/images/sections/treasure-vault.jpg",
    date: "2026-03-18",
    readTime: 10,
    author: "LUCKY TCG THAILAND",
    tags: ["ประวัติ", "OPTCG", "Bandai", "TCG"],
    sections: [
      {
        heading: "จุดเริ่มต้น (2022)",
        icon: "⚓",
        paragraphs: [
          "Bandai ประกาศ One Piece Card Game อย่างเป็นทางการในงาน Jump Festa ปลายปี 2021 และวางจำหน่ายชุดแรก Romance Dawn (OP-01) ที่ญี่ปุ่นวันที่ 22 กรกฎาคม 2022",
          "ความนิยมระเบิดตั้งแต่วันแรก กล่อง OP-01 ขายหมดเกลี้ยงภายในไม่กี่ชั่วโมง Bandai ต้องเพิ่มกำลังผลิตถึง 3 รอบ เป็นสถิติที่ไม่เคยเกิดขึ้นมาก่อนกับ TCG ใหม่",
          "เวอร์ชันภาษาอังกฤษตามมาในเดือนธันวาคม 2022 และได้รับความนิยมล้นหลามทั่วโลกเช่นกัน",
        ],
      },
      {
        heading: "การเติบโตแบบก้าวกระโดด (2023)",
        icon: "🚀",
        paragraphs: [
          "ปี 2023 เป็นปีแห่งการเติบโตครั้งใหญ่ OPTCG กลายเป็น TCG ที่มียอดขายสูงสุดในญี่ปุ่น แซงหน้า Pokemon TCG และ Yu-Gi-Oh! ในหลายไตรมาส",
          "Bandai จัดทัวร์นาเม้นต์ระดับโลกชื่อ One Piece Championship Series ครอบคลุมญี่ปุ่น อเมริกาเหนือ ยุโรป และเอเชีย",
          "การ์ดหายากอย่าง Shanks SEC จาก OP-01 พุ่งราคาขึ้นหลายเท่า สร้างตลาดรองที่คึกคักมาก",
        ],
      },
      {
        heading: "ยุคทอง (2024-2025)",
        icon: "👑",
        paragraphs: [
          "OPTCG ออกเซ็ตใหม่อย่างต่อเนื่อง ปีละ 4-6 เซ็ตหลัก พร้อม Extra Booster และ Premium Booster เสริม ทำให้เกมมีความหลากหลายและ Meta เปลี่ยนแปลงตลอด",
          "ในประเทศไทย OPTCG ได้รับความนิยมอย่างมาก มีกลุ่มผู้เล่นและนักสะสมเพิ่มขึ้นเรื่อยๆ มีการจัดแข่งขันทั้งอย่างเป็นทางการและไม่เป็นทางการทั่วประเทศ",
        ],
      },
      {
        heading: "ปัจจุบัน (2026)",
        icon: "🌊",
        paragraphs: [
          "ด้วยเซ็ตที่ออกมาถึง OP-15 และ EB-04 OPTCG ยังคงรักษาตำแหน่ง TCG ชั้นนำของโลก ภาพวาดที่สวยงาม ระบบเกมที่สมดุล และฐานแฟน One Piece ที่แข็งแกร่ง ทำให้เกมนี้มีอนาคตที่สดใส",
          "Bandai ยังคงพัฒนาทั้งด้านการแข่งขันและการสะสม ด้วย Alternate Art, Manga Art และ Special Art versions ที่ออกแบบมาอย่างประณีต",
        ],
      },
    ],
  },

  // ─── 3. Rarity Guide ───
  {
    slug: "optcg-rarity-guide",
    title: "ระบบ Rarity ของ OPTCG: การ์ดแบบไหนหายากที่สุด?",
    excerpt: "ทำความเข้าใจระบบความหายากของการ์ด ตั้งแต่ Common ไปจนถึง Secret Rare และ Treasure Rare",
    category: "collecting",
    coverImage: "/images/sections/bounty-board.jpg",
    date: "2026-03-15",
    readTime: 8,
    author: "LUCKY TCG THAILAND",
    tags: ["Rarity", "สะสม", "Secret Rare", "Treasure Rare"],
    sections: [
      {
        heading: "ระดับ Rarity ทั้งหมด",
        icon: "✨",
        paragraphs: [
          "OPTCG มีระบบ Rarity ที่หลากหลาย แต่ละระดับมีจำนวนการ์ดที่แตกต่างกัน และส่งผลต่อมูลค่าของการ์ดโดยตรง",
        ],
        list: [
          "C (Common) — การ์ดพื้นฐาน ได้ง่ายที่สุด ทุกซองมี 3-4 ใบ",
          "UC (Uncommon) — หายากกว่า Common เล็กน้อย ได้ 1-2 ใบต่อซอง",
          "R (Rare) — การ์ดหายากระดับกลาง ได้ประมาณ 1 ใบต่อซอง",
          "SR (Super Rare) — หายาก ได้ประมาณ 2 ใบต่อกล่อง ภาพสวยและมีผลต่อเกม",
          "SEC (Secret Rare) — หายากมาก ลุ้นประมาณ 1 ใน 2-3 กล่อง เป็นการ์ดที่นักสะสมตามหา",
          "L (Leader) — การ์ด Leader มี Rarity เฉพาะ ได้ 1 ใบต่อกล่อง",
          "SP (Special) — การ์ด Parallel/Alternate Art ที่มีภาพวาดพิเศษ",
          "TR (Treasure Rare) — หายากที่สุด! การ์ด Gold Foil สุดพิเศษ ลุ้น 1 ในหลายสิบกล่อง",
        ],
      },
      {
        heading: "Parallel Art คืออะไร?",
        icon: "🎨",
        paragraphs: [
          "นอกจาก Rarity แล้ว OPTCG ยังมีระบบ Parallel Art ที่ทำให้การ์ดใบเดียวกันมีหลายเวอร์ชัน แต่ละเวอร์ชันมีภาพวาดที่แตกต่างกัน",
          "Parallel versions มักมีราคาสูงกว่า Normal version หลายเท่า โดยเฉพาะ Alternate Art ของตัวละครยอดนิยมอย่าง Luffy, Shanks, Ace หรือ Yamato",
        ],
        list: [
          "Normal Art — ภาพมาตรฐาน",
          "Alternate Art — ภาพวาดใหม่ทั้งหมด สวยงามมาก",
          "Manga Art — ภาพจากมังงะต้นฉบับ หายากและเป็นที่ต้องการ",
          "Special Art — ภาพพิเศษเฉพาะเซ็ต มักเป็น Full Art",
        ],
      },
      {
        heading: "การ์ดไหนมีมูลค่าสูงสุด?",
        icon: "💎",
        paragraphs: [
          "การ์ดที่มีมูลค่าสูงที่สุดมักเป็น SEC หรือ Alternate Art ของตัวละครยอดนิยม โดยเฉพาะจากเซ็ตแรกๆ ที่พิมพ์น้อยกว่า",
        ],
        list: [
          "Shanks SEC (OP-01) — การ์ดในตำนาน หนึ่งในการ์ด OPTCG ที่แพงที่สุด",
          "Monkey D. Luffy Gear 5 SEC (OP-05) — การ์ดที่แฟนทุกคนอยากได้",
          "Nami SP Alt Art — Alternate Art ของ Nami มักมีราคาสูงทุกเซ็ต",
          "Treasure Rare ทุกใบ — ด้วยความหายากสุดขีด การ์ด TR มีมูลค่าสูงเสมอ",
        ],
        tip: "การ์ด JP version มักราคาสูงกว่า EN version เนื่องจากออกก่อนและภาพพิมพ์คมชัดกว่า",
      },
    ],
  },

  // ─── 4. JP vs EN ───
  {
    slug: "jp-vs-en-optcg",
    title: "JP vs EN: ซื้อการ์ดเวอร์ชันไหนดี?",
    excerpt: "เปรียบเทียบข้อดีข้อเสียระหว่างการ์ด One Piece เวอร์ชันญี่ปุ่นกับอังกฤษ ทั้งด้านราคา คุณภาพ และการลงทุน",
    category: "collecting",
    coverImage: "/images/sections/shop-bazaar.jpg",
    date: "2026-03-10",
    readTime: 7,
    author: "LUCKY TCG THAILAND",
    tags: ["JP", "EN", "เปรียบเทียบ", "ลงทุน"],
    sections: [
      {
        heading: "ทำไมมี 2 เวอร์ชัน?",
        icon: "🌏",
        paragraphs: [
          "OPTCG วางจำหน่ายเป็น 2 ภาษาหลัก คือ Japanese (JP) และ English (EN) โดยเวอร์ชัน JP จะออกก่อนประมาณ 3-6 เดือน ทำให้ผู้เล่น JP ได้เล่นการ์ดใหม่ก่อนเสมอ",
        ],
      },
      {
        heading: "ข้อดีของ JP Version",
        icon: "🇯🇵",
        paragraphs: [
          "การ์ดเวอร์ชันญี่ปุ่นเป็นที่นิยมมากในตลาดไทยและเอเชีย",
        ],
        list: [
          "ออกก่อน EN 3-6 เดือน — ได้เล่น Meta ใหม่ก่อนใคร",
          "คุณภาพการพิมพ์ดีกว่า — สีสดกว่า เนื้อกระดาษดีกว่า",
          "ราคารีเซลสูงกว่า — การ์ดหายาก JP มักแพงกว่า EN 20-50%",
          "เป็นภาษาต้นฉบับ — ถูกใจนักสะสมแนว Original",
          "Print run น้อยกว่าบางเซ็ต — ทำให้หายากกว่าในระยะยาว",
        ],
      },
      {
        heading: "ข้อดีของ EN Version",
        icon: "🇺🇸",
        paragraphs: [
          "เวอร์ชันอังกฤษก็มีข้อดีของตัวเอง",
        ],
        list: [
          "อ่านง่าย — ถ้าไม่รู้ภาษาญี่ปุ่น EN อ่านได้สะดวกกว่า",
          "ราคา Box ถูกกว่า — EN Box มักราคาต่ำกว่า JP 10-20%",
          "ใช้แข่งอย่างเป็นทางการ — ทัวร์นาเม้นต์สากลใช้ EN เป็นหลัก",
          "หาซื้อง่ายกว่า — มีจำหน่ายทั่วโลก",
        ],
      },
      {
        heading: "แล้วควรซื้อแบบไหน?",
        icon: "🤔",
        paragraphs: [
          "ถ้าเน้นสะสมและลงทุน: JP เป็นตัวเลือกที่ดีกว่า เพราะราคารีเซลสูงกว่าและคุณภาพดีกว่า",
          "ถ้าเน้นเล่น: EN จะสะดวกกว่าถ้าไม่อ่านภาษาญี่ปุ่น แต่ถ้าจำ effect ได้ JP ก็เล่นได้สบาย",
          "ที่ LUCKY TCG THAILAND เราขาย JP version เป็นหลัก เพราะลูกค้าส่วนใหญ่ชอบคุณภาพและมูลค่าการรีเซลที่ดีกว่า",
        ],
      },
    ],
  },

  // ─── 5. Collecting Tips ───
  {
    slug: "optcg-collecting-tips",
    title: "เคล็ดลับสะสมการ์ด OPTCG: เก็บยังไงให้คุ้มค่า",
    excerpt: "ทิปส์จากคนในวงการ วิธีเก็บรักษาการ์ด การเลือกซื้อ Box และสิ่งที่มือใหม่ควรระวัง",
    category: "collecting",
    coverImage: "/images/sections/captain-desk.jpg",
    date: "2026-03-05",
    readTime: 9,
    author: "LUCKY TCG THAILAND",
    tags: ["สะสม", "เก็บรักษา", "ลงทุน", "Sleeve"],
    sections: [
      {
        heading: "อุปกรณ์ที่ต้องมี",
        icon: "🛡️",
        paragraphs: [
          "การ์ดที่ไม่ได้รับการป้องกันจะเสื่อมสภาพเร็วมาก ลงทุนกับอุปกรณ์เก็บรักษาตั้งแต่ต้น",
        ],
        list: [
          "Inner Sleeve — ซองในชั้นแรก ป้องกันรอยขีดข่วน ควรมีเสมอ",
          "Outer Sleeve — ซองนอกเพิ่มความแข็งแรง สำหรับเล่นควรใช้ Matte",
          "Top Loader — แผ่นพลาสติกแข็ง สำหรับการ์ดราคาแพงที่ไม่ได้เล่น",
          "Binder (9-pocket) — สมุดเก็บการ์ด สำหรับจัดเรียงคอลเลกชัน",
          "Desiccant / Silica Gel — กันความชื้น เมืองไทยอากาศชื้นมากต้องระวัง",
        ],
        tip: "อย่าใช้ Sleeve ราคาถูกมากกับการ์ดที่มีค่า เพราะ PVC คุณภาพต่ำอาจทำลายผิวการ์ดในระยะยาว",
      },
      {
        heading: "ซื้อ Box หรือซื้อ Single ดีกว่า?",
        icon: "📊",
        paragraphs: [
          "คำถามยอดฮิตของมือใหม่ คำตอบขึ้นอยู่กับเป้าหมาย",
          "ถ้าอยากสนุกกับการลุ้น: ซื้อ Box เปิดเอง ตื่นเต้นทุกซอง และได้เก็บการ์ดครบเซ็ต",
          "ถ้าอยากได้การ์ดเฉพาะใบ: ซื้อ Single คุ้มกว่า เพราะการ์ด SEC 1 ใบอาจต้องเปิดหลายกล่องถึงจะได้",
        ],
      },
      {
        heading: "เซ็ตไหนน่าสะสมที่สุด?",
        icon: "🏆",
        paragraphs: [
          "เซ็ตแรกๆ ของเกมมักมีมูลค่าสูงสุด เพราะ Print run น้อยและมีการ์ดในตำนาน",
        ],
        list: [
          "OP-01 Romance Dawn — เซ็ตแรก มี Shanks SEC ในตำนาน",
          "OP-02 Paramount War — มีตัวละครจาก Marineford Arc ยอดนิยม",
          "OP-05 Awakening of the New Era — มี Luffy Gear 5 SEC ที่ทุกคนตามหา",
          "EB-01 Memorial Collection — เซ็ตพิเศษที่มี Alternate Art สวยงาม",
        ],
      },
      {
        heading: "การ Grading การ์ด",
        icon: "📐",
        paragraphs: [
          "การส่ง Grade การ์ดกับบริษัทเช่น PSA หรือ BGS เป็นวิธีเพิ่มมูลค่าและรับรองสภาพการ์ด",
          "การ์ด PSA 10 (Gem Mint) มักมีมูลค่าสูงกว่าการ์ด Ungraded หลายเท่า โดยเฉพาะการ์ดหายาก แต่ค่าส่ง Grade ก็ไม่ถูก ควรเลือก Grade เฉพาะการ์ดที่มีมูลค่าคุ้มกับค่าใช้จ่าย",
        ],
        tip: "ถ้าวางแผนจะส่ง Grade ควรใส่ Sleeve + Top Loader ตั้งแต่เปิดซอง อย่าจับหน้าการ์ดด้วยมือเปล่า",
      },
    ],
  },

  // ─── 6. Strategy Guide ───
  {
    slug: "optcg-deck-building-basics",
    title: "แนวทางสร้าง Deck สำหรับมือใหม่",
    excerpt: "หลักการพื้นฐานในการสร้าง Deck ที่มีประสิทธิภาพ ตั้งแต่เลือก Leader ไปจนถึงจัด Curve ให้สมดุล",
    category: "strategy",
    coverImage: "/images/sections/set-sail.jpg",
    date: "2026-02-28",
    readTime: 10,
    author: "LUCKY TCG THAILAND",
    tags: ["Deck Building", "Strategy", "มือใหม่", "Meta"],
    sections: [
      {
        heading: "เลือก Leader ก่อน",
        icon: "🎯",
        paragraphs: [
          "Leader Card เป็นหัวใจของ Deck ทุกอย่างเริ่มจากตรงนี้ Leader กำหนดสีของ Deck, จำนวน Life, Power base และความสามารถพิเศษ",
          "สำหรับมือใหม่ แนะนำเลือก Leader ที่มี Effect เข้าใจง่ายและ Life 5 (อยู่ได้นานกว่า) เช่น Leader Luffy สีแดง ที่เน้น Aggro ตรงไปตรงมา",
        ],
      },
      {
        heading: "หลัก Cost Curve",
        icon: "📈",
        paragraphs: [
          "Cost Curve คือการกระจาย Character ตามค่า Cost ให้สมดุล Deck ที่ดีควรมี",
        ],
        list: [
          "Cost 1-2: 8-12 ใบ — การ์ดเริ่มเกม ลงได้ตั้งแต่เทิร์นแรกๆ",
          "Cost 3-4: 10-15 ใบ — แกนหลักของ Deck ใช้บ่อยที่สุด",
          "Cost 5-7: 6-10 ใบ — การ์ดหลักช่วงกลาง-ปลายเกม",
          "Cost 8+: 2-4 ใบ — Finisher การ์ดตัวจบเกม",
          "Event cards: 6-10 ใบ — การ์ดกลยุทธ์ Counter และ removal",
        ],
        tip: "อย่าใส่การ์ด Cost สูงเยอะเกินไป เพราะจะจั่วมาแล้วเล่นไม่ได้ในเทิร์นต้นๆ ทำให้เสียจังหวะ",
      },
      {
        heading: "Counter คือชีวิต",
        icon: "🛡️",
        paragraphs: [
          "ระบบ Counter ใน OPTCG สำคัญมาก การ์ดบางใบมี Counter +1000 หรือ +2000 ที่ใช้ป้องกันการโจมตีจากมือได้",
          "Deck ที่ดีควรมีการ์ดที่มี Counter อย่างน้อย 60-70% ของ Deck เพื่อให้มีตัวเลือกป้องกันเพียงพอ",
        ],
      },
      {
        heading: "เล่นแล้วปรับ",
        icon: "🔄",
        paragraphs: [
          "ไม่มี Deck ไหนสมบูรณ์แบบตั้งแต่แรก เล่นไป 10-20 เกม แล้วสังเกตว่าการ์ดไหนจั่วมาแล้วไม่อยากเห็น การ์ดนั้นควรถูกเปลี่ยนออก",
          "ติดตาม Meta จากทัวร์นาเม้นต์และ Community เพื่อดูว่า Deck ไหนกำลังแรง และเตรียมรับมือ",
        ],
      },
    ],
  },

  // ─── 7. News ───
  {
    slug: "optcg-2026-whats-new",
    title: "สรุปข่าว OPTCG ต้นปี 2026: เซ็ตใหม่และ Meta ล่าสุด",
    excerpt: "อัพเดทล่าสุดของวงการ One Piece Card Game เซ็ตที่เพิ่งออก Meta ที่เปลี่ยน และสิ่งที่กำลังจะมา",
    category: "news",
    coverImage: "/images/sections/shop-bazaar.jpg",
    date: "2026-03-25",
    readTime: 6,
    author: "LUCKY TCG THAILAND",
    tags: ["ข่าว", "2026", "เซ็ตใหม่", "Meta"],
    sections: [
      {
        heading: "เซ็ตล่าสุดที่วางจำหน่าย",
        icon: "🆕",
        paragraphs: [
          "ในช่วงปลายปี 2025 ถึงต้นปี 2026 Bandai ได้ออกเซ็ตใหม่หลายชุด",
        ],
        list: [
          "OP-13 — เซ็ตที่ครอบคลุม Arc ล่าสุดของ One Piece",
          "OP14-EB04 — เซ็ตพิเศษรวม Booster และ Extra Booster",
          "OP-15 Adventure on Kami's Island — เซ็ตล่าสุดที่เพิ่งวางจำหน่าย",
          "PRB-02 — Premium Booster ชุดที่ 2 สำหรับนักสะสม",
        ],
      },
      {
        heading: "Meta ปัจจุบัน",
        icon: "⚔️",
        paragraphs: [
          "Meta ของ OPTCG เปลี่ยนแปลงทุกครั้งที่มีเซ็ตใหม่ออก ทำให้เกมมีความหลากหลายและตื่นเต้นอยู่เสมอ",
          "Leader ยอดนิยมในปี 2026 มีหลากหลายสี ไม่มีสีไหนครอง Meta เพียงสีเดียว ซึ่งเป็นสัญญาณที่ดีของ Game Balance",
        ],
      },
      {
        heading: "กำลังจะมา",
        icon: "🔮",
        paragraphs: [
          "Bandai ยังคงมีแผนออกเซ็ตใหม่อย่างต่อเนื่อง กับ OP-16 และ EB-05 ที่กำลังจะตามมา พร้อมกับทัวร์นาเม้นต์ระดับโลกที่จะจัดขึ้นตลอดปี 2026",
          "สำหรับนักสะสม Bandai ยังคงออก Special Art และ Manga Art ที่สวยงามอย่างต่อเนื่อง ทำให้ตลาดการสะสมยังคงคึกคัก",
        ],
      },
      {
        heading: "ซื้อได้ที่ LUCKY TCG THAILAND",
        icon: "🏪",
        paragraphs: [
          "ที่ LUCKY TCG THAILAND เรามีทุกเซ็ตล่าสุดพร้อมจำหน่าย ทั้ง Booster Box, Starter Deck, Extra Booster และ Premium Booster ส่งตรงจากญี่ปุ่น ของแท้ 100% พร้อมส่วนลดสำหรับสมาชิก Bounty Rank",
        ],
      },
    ],
  },
];
