# GOODGUY TCG — Project Summary
> เอกสารสรุปโครงสร้างเว็บไซต์ร้านขายการ์ด One Piece TCG
> วันที่: 25 มีนาคม 2026

---

## 1. Overview

| รายการ | รายละเอียด |
|--------|-----------|
| **ชื่อโปรเจค** | GOODGUY TCG Store |
| **ประเภท** | E-commerce ขายการ์ด One Piece Card Game (JP version) |
| **Framework** | Next.js 16 + React 19 + TypeScript |
| **Database** | PostgreSQL (Prisma ORM) |
| **Authentication** | NextAuth 5 (Email/Password + LINE OAuth) |
| **UI/Animation** | Tailwind CSS 4 + Framer Motion |
| **Deployment** | Docker + Docker Compose (พร้อม deploy บน VPS) |
| **จำนวนไฟล์รวม** | ~133 files |

---

## 2. Tech Stack

```
Frontend:  Next.js 16.2.1 / React 19 / Tailwind CSS 4 / Framer Motion
Backend:   Next.js API Routes (Server-side)
Database:  PostgreSQL 16 + Prisma ORM 7.5
Auth:      NextAuth 5 (JWT strategy)
Deploy:    Docker multi-stage build + Docker Compose
Card Data: OPTCG API + Limitless TCG CDN (JP/EN images)
```

---

## 3. หน้าเว็บทั้งหมด (24 หน้า)

### หน้าสาธารณะ (Public)
| URL | หน้า | รายละเอียด |
|-----|------|-----------|
| `/` | Home | Landing page, hero, Grand Line map, premium cards, bounty rank, spin wheel |
| `/shop` | Shop | รายการสินค้าทั้งหมด พร้อม filter (category, status, price) |
| `/shop/[slug]` | Product Detail | รายละเอียดสินค้า, drop rates, card list, island lore |
| `/cards` | Card Browser | ค้นหาการ์ดจากทุก set (1,000+ ใบ) JP/EN toggle |
| `/cards/[cardId]` | Card Detail | รายละเอียดการ์ด (stats, effect, market price, JP/EN toggle) |
| `/blog` | Blog | บทความทั้งหมด 7 บทความ |
| `/blog/[slug]` | Blog Article | อ่านบทความ |
| `/cart` | Cart | ตะกร้าสินค้า + checkout + upload slip |
| `/membership` | Membership Tiers | สิทธิพิเศษแต่ละ rank + วิธีสะสม |

### หน้าสมาชิก (Auth Required)
| URL | หน้า | รายละเอียด |
|-----|------|-----------|
| `/profile` | Profile | ข้อมูลสมาชิก, rank, referral code, order history |
| `/auth/login` | Login | เข้าสู่ระบบ (email/password) |
| `/auth/register` | Register | สมัครสมาชิก + ช่อง referral code |

### หน้า Admin (Admin Only)
| URL | หน้า | รายละเอียด |
|-----|------|-----------|
| `/admin` | Dashboard | สถิติยอดขาย, ออเดอร์, สมาชิก |
| `/admin/products` | Products | CRUD สินค้า (เพิ่ม/แก้/ลบ/อัพโหลดรูป) Modal 4 tabs |
| `/admin/orders` | Orders | รายการออเดอร์ + ตรวจสอบ payment proof |
| `/admin/orders/[orderId]` | Order Detail | รายละเอียดออเดอร์ + อัพเดทสถานะ |
| `/admin/customers` | Customers | รายชื่อสมาชิก + rank + ยอดซื้อ |

---

## 4. API Endpoints (21 routes)

### Authentication
| Method | Endpoint | ใช้ทำอะไร |
|--------|----------|----------|
| POST | `/api/auth/register` | สมัครสมาชิก (รับ referralCode) |
| * | `/api/auth/[...nextauth]` | NextAuth handler (login/logout/session) |

### User
| Method | Endpoint | ใช้ทำอะไร |
|--------|----------|----------|
| GET/PUT | `/api/user/profile` | ดู/แก้ไข profile |
| GET/POST | `/api/user/addresses` | จัดการที่อยู่จัดส่ง |
| GET | `/api/user/referral` | ดูโค้ดชวนเพื่อน + สถิติ |

### Products & Orders
| Method | Endpoint | ใช้ทำอะไร |
|--------|----------|----------|
| GET | `/api/products` | รายการสินค้า (filter: status, category, search) |
| GET | `/api/products/[slug]` | รายละเอียดสินค้า |
| POST | `/api/orders` | สร้างออเดอร์ (checkout) |
| POST | `/api/orders/[id]/upload-slip` | อัพโหลดสลิปโอนเงิน |
| GET | `/api/referral/validate` | ตรวจสอบ referral code |

### Admin
| Method | Endpoint | ใช้ทำอะไร |
|--------|----------|----------|
| POST | `/api/admin/products` | เพิ่มสินค้าใหม่ |
| PATCH | `/api/admin/products/[id]` | แก้ไขสินค้า (ทุก field) |
| DELETE | `/api/admin/products/[id]` | ลบสินค้า (ป้องกันถ้ามี order) |
| POST | `/api/admin/products/[id]/upload-image` | อัพโหลดรูปสินค้า |
| GET | `/api/admin/orders` | รายการออเดอร์ทั้งหมด |
| POST | `/api/admin/orders/[id]/verify-payment` | ยืนยันการชำระเงิน |
| GET | `/api/admin/customers` | รายการลูกค้า |
| GET | `/api/admin/stats` | สถิติ dashboard |

---

## 5. Database Models

```
User              ─── สมาชิก (email, password, rank, referral)
  ├── Order       ─── ออเดอร์
  │   ├── OrderItem    ─── รายการสินค้าในออเดอร์
  │   └── PaymentProof ─── สลิปโอนเงิน
  ├── ShippingAddress  ─── ที่อยู่จัดส่ง
  └── User (self-ref)  ─── ระบบชวนเพื่อน (referredBy)

Product           ─── สินค้า (TCG box sets)
```

### User Model
| Field | Type | หมายเหตุ |
|-------|------|---------|
| email | String (unique) | อีเมลเข้าสู่ระบบ |
| passwordHash | String | BCrypt hash |
| displayName | String | ชื่อแสดง |
| phone, lineId | String | ข้อมูลติดต่อ |
| totalSpent | Int | ยอดซื้อสะสม (คำนวณ rank) |
| orderCount | Int | จำนวนออเดอร์ |
| role | CUSTOMER / ADMIN | สิทธิ์ |
| referralCode | String (unique) | โค้ดชวนเพื่อน GG-XXXXXX |
| referredById | String? | ใครชวนมา |

### Product Model
| Field | Type | หมายเหตุ |
|-------|------|---------|
| name, slug, code | String | ชื่อ, URL slug, รหัสสินค้า |
| pricePerBox | Int | ราคาต่อกล่อง (บาท) |
| stock | Int | จำนวนคงเหลือ |
| status | IN_STOCK / PRE_ORDER / SOLD_OUT | สถานะ |
| category | BOOSTER / EXTRA / PREMIUM / STARTER | ประเภท |
| packsPerBox, cardsPerPack | Int | ซอง/กล่อง, ใบ/ซอง |
| islandTheme | JSON | ธีมเกาะสำหรับ Grand Line map |

### Order Model
| Field | Type | หมายเหตุ |
|-------|------|---------|
| orderNumber | String | เลขออเดอร์ GG260325-XXXX |
| status | 7 สถานะ | PENDING → DELIVERED |
| subtotal, discountAmount, total | Int | ยอดเงิน |
| discountRank | String | เช่น "Paradise + Referral 3%" |
| shipping* | String | ข้อมูลจัดส่ง |
| trackingNumber | String | เลข tracking |

---

## 6. ระบบ Membership (Bounty Rank)

| Rank | ยอดซื้อขั้นต่ำ | ส่วนลด | สิทธิพิเศษ |
|------|---------------|--------|-----------|
| 🌊 East Blue | ฿0 | 0% | สมาชิกพื้นฐาน, Spin Wheel |
| ⚓ Paradise | ฿5,000 | 3% | แจ้งเตือนสินค้าใหม่, Pre-order ก่อนใคร |
| 🔥 New World | ฿15,000 | 5% | ส่งฟรี, ของแถม, Priority packing |
| 👑 Yonko | ฿50,000 | 8% | VIP Event, Exclusive Promo Card, LINE กลุ่มลับ |

### Referral System
- สมาชิกทุกคนมีโค้ด `GG-XXXXXX`
- เพื่อนใส่โค้ดตอนสมัคร → ออเดอร์แรกลด 3% (ซ้อนกับ rank discount)
- Profile แสดงจำนวนคนที่ชวนมา

---

## 7. ระบบ Card Browser

- **ข้อมูลการ์ด**: 19 sets, 1,000+ ใบ (เก็บใน JSON, ดึงจาก OPTCG API)
- **JP/EN Toggle**: สลับภาษาการ์ดได้ (รูปจาก Limitless TCG CDN)
- **Filter**: by rarity (L, SEC, SR, R, UC, C), search by name/type
- **Card Detail**: stats, effect text, market price, rarity distribution

---

## 8. Blog (7 บทความ)

1. **คู่มือมือใหม่ One Piece Card Game** — วิธีเล่น, สร้างเด็ค, ซื้อสินค้าแรก
2. **ประวัติ OPTCG** — จุดเริ่มต้น, การเติบโต, สถิติ
3. **ระบบ Rarity** — อธิบาย C/UC/R/SR/SEC/Manga Rare + pull rates
4. **เกมแข่งขัน** — โครงสร้างทัวร์นาเมนต์, ไทยซีน
5. **เทคนิคสะสมการ์ด** — grading, storage, ป้องกันของปลอม
6. **JP vs EN** — เปรียบเทียบราคา, ข้อดีข้อเสีย
7. **ข่าวล่าสุด 2025-2026** — set releases, Block Rotation, worldwide release

---

## 9. Components (19 ตัว)

### Admin (2)
- `ProductModal` — Modal เพิ่ม/แก้ไขสินค้า (4 tabs: Basic/Box/Image/Theme)
- `CustomerModal` — Modal ดูข้อมูลลูกค้า

### Gamification (3)
- `BountyRank` — แสดง rank + progress bar
- `RankBadge` — SVG badge ธีม One Piece (4 designs)
- `SpinWheel` — วงล้อลุ้นรางวัล

### Layout (5)
- `Navbar` — Navigation bar + mobile hamburger
- `Footer` — Footer + links
- `CloudTransition` — Cloud wipe ระหว่าง section
- `PageTransition` — Wave wipe เปลี่ยนหน้า
- `ParticleBackground` — อนุภาคลอยพื้นหลัง

### Shop (4)
- `IslandMap` — แผนที่ Grand Line + pin สินค้า
- `PremiumCards` — การ์ด SEC ไฮไลท์
- `SetCard` — การ์ดสินค้า (grid)
- `SetCardList` — รายการการ์ดใน set + JP/EN toggle

### UI Effects (5)
- `TiltCard` — 3D tilt + holographic shimmer ตาม mouse
- `LootBoxAnimation` — Treasure chest เปิดตอน add to cart
- `TreasureToast` — Toast notification แบบ bounty poster
- `ScrollReveal` — Scroll-triggered reveal animation
- `RankUpCelebration` — Full-screen celebration เมื่อ rank ขึ้น

---

## 10. Security

| Feature | รายละเอียด |
|---------|-----------|
| Password Hashing | BCrypt (12 rounds) |
| Session | JWT strategy (NextAuth) |
| Route Protection | Middleware ป้องกัน /admin, /profile, /api/admin |
| Admin Auth | Role-based (CUSTOMER vs ADMIN) |
| Rate Limiting | 10 login attempts / 15 min per email |
| File Upload | Max 5MB, JPG/PNG/WebP only |
| CSRF | NextAuth built-in |

---

## 11. Deployment

### Docker
```bash
docker-compose up -d    # Start PostgreSQL + App
docker-compose down     # Stop
```

### Environment Variables (.env)
```
DATABASE_URL=postgresql://user:pass@localhost:5433/goodguytcg
AUTH_SECRET=<random-secret>
NEXTAUTH_URL=http://localhost:3000
AUTH_LINE_ID=<line-oauth-id>
AUTH_LINE_SECRET=<line-oauth-secret>
ADMIN_EMAIL=admin@goodguytcg.com
ADMIN_PASSWORD=<admin-password>
```

### Build & Run
```bash
npm install
npx prisma db push          # Create tables
npx tsx prisma/seed.ts       # Seed data (products + admin user)
npm run dev                  # Development
npm run build && npm start   # Production
```

---

## 12. สิ่งที่ยังไม่ได้ทำ (Phase 2)

| # | งาน | ความสำคัญ |
|---|------|-----------|
| 1 | Payment Gateway (PromptPay QR auto-verify) | 🔴 สูง |
| 2 | Email Notification (order confirm, shipping) | 🔴 สูง |
| 3 | External File Storage (S3/Cloudflare R2) | 🟡 กลาง |
| 4 | Error Monitoring (Sentry) | 🟡 กลาง |
| 5 | Google Analytics | 🟢 ต่ำ |
| 6 | LINE OAuth credentials | 🟢 ต่ำ |
| 7 | Automated DB backup | 🟡 กลาง |

---

## 13. File Structure

```
GOODGUYTCG/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── public/
│   ├── images/
│   │   ├── sets/              # 22 product images
│   │   ├── sections/          # 5 section backgrounds
│   │   └── map/               # Grand Line map
│   └── uploads/               # User uploads (slips, product images)
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home
│   │   ├── shop/              # Shop pages
│   │   ├── cards/             # Card browser
│   │   ├── blog/              # Blog pages
│   │   ├── cart/              # Shopping cart
│   │   ├── membership/        # Membership tiers
│   │   ├── profile/           # User profile
│   │   ├── auth/              # Login/Register
│   │   ├── admin/             # Admin panel (4 pages)
│   │   └── api/               # 21 API routes
│   ├── components/
│   │   ├── admin/             # Admin components (2)
│   │   ├── gamification/      # Rank/Spin (3)
│   │   ├── layout/            # Navbar/Footer/Transitions (5)
│   │   ├── shop/              # Shop components (4)
│   │   └── ui/                # UI effects (5)
│   ├── data/                  # 19 card JSON + blog posts
│   ├── hooks/                 # useCart, useToast
│   ├── lib/                   # auth, db, constants, utils
│   └── types/                 # TypeScript definitions
├── Dockerfile                 # Production Docker build
├── docker-compose.yml         # Dev environment
├── package.json
└── next.config.ts
```

---

> **หมายเหตุ**: เอกสารนี้สร้างอัตโนมัติจากโครงสร้างโปรเจคจริง ณ วันที่ 25 มี.ค. 2026
