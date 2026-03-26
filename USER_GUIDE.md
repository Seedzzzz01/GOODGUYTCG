# 📖 คู่มือการใช้งาน LUCKY TCG THAILAND Store
> เอกสารสอนใช้งานเว็บไซต์สำหรับเจ้าของร้าน + แอดมิน
> อัพเดท: 25 มีนาคม 2026

---

## สารบัญ

### ส่วนที่ 1: สำหรับลูกค้า
- [1.1 สมัครสมาชิก](#11-สมัครสมาชิก)
- [1.2 เข้าสู่ระบบ](#12-เข้าสู่ระบบ)
- [1.3 หน้าแรก (Home)](#13-หน้าแรก)
- [1.4 ร้านค้า (Shop)](#14-ร้านค้า)
- [1.5 รายละเอียดสินค้า](#15-รายละเอียดสินค้า)
- [1.6 ดูการ์ดในกล่อง (Card Browser)](#16-ดูการ์ดในกล่อง)
- [1.7 ตะกร้าสินค้า + สั่งซื้อ](#17-ตะกร้าสินค้า--สั่งซื้อ)
- [1.8 อัพโหลดสลิปโอนเงิน](#18-อัพโหลดสลิปโอนเงิน)
- [1.9 โปรไฟล์สมาชิก](#19-โปรไฟล์สมาชิก)
- [1.10 Bounty Rank (ระบบสมาชิก)](#110-bounty-rank)
- [1.11 ชวนเพื่อน (Referral)](#111-ชวนเพื่อน)
- [1.12 Blog บทความ](#112-blog)

### ส่วนที่ 2: สำหรับแอดมิน
- [2.1 เข้า Admin Panel](#21-เข้า-admin-panel)
- [2.2 Dashboard](#22-dashboard)
- [2.3 จัดการสินค้า (Products)](#23-จัดการสินค้า)
- [2.4 จัดการออเดอร์ (Orders)](#24-จัดการออเดอร์)
- [2.5 จัดการลูกค้า (Customers)](#25-จัดการลูกค้า)
- [2.6 Flow การทำงานประจำวัน](#26-flow-การทำงานประจำวัน)

### ส่วนที่ 3: การตั้งค่าระบบ
- [3.1 Environment Variables](#31-environment-variables)
- [3.2 Seed ข้อมูลเริ่มต้น](#32-seed-ข้อมูลเริ่มต้น)
- [3.3 สร้าง Admin Account](#33-สร้าง-admin-account)
- [3.4 Docker](#34-docker)

---

# ส่วนที่ 1: สำหรับลูกค้า

---

## 1.1 สมัครสมาชิก

**URL:** `/auth/register`

### ขั้นตอน:
1. กดปุ่ม **"Join Bounty Crew"** ที่หน้าแรก หรือเข้า `/auth/register`
2. กรอกข้อมูล:
   - **ชื่อที่แสดง** — ชื่อที่จะแสดงในเว็บ (เช่น "Monkey D. Luffy")
   - **อีเมล** — ใช้เข้าสู่ระบบ
   - **รหัสผ่าน** — อย่างน้อย 6 ตัวอักษร
   - **ยืนยันรหัสผ่าน** — กรอกซ้ำ
   - **โค้ดชวนเพื่อน** (ไม่บังคับ) — ถ้ามีโค้ดจากเพื่อน ใส่ตรงนี้ได้ส่วนลด 3% ออเดอร์แรก
3. กด **"สมัครสมาชิก"**
4. ระบบจะ login อัตโนมัติ → ไปหน้า Profile

### หมายเหตุ:
- โค้ดชวนเพื่อนมีรูปแบบ `GG-XXXXXX` (เช่น GG-K7NH3P)
- ถ้าโค้ดถูกต้อง จะแสดง **"✓ ได้ส่วนลด 3%"** สีเขียว
- สามารถใส่โค้ดผ่าน link ได้: `yoursite.com/auth/register?ref=GG-K7NH3P`

---

## 1.2 เข้าสู่ระบบ

**URL:** `/auth/login`

1. กรอก **อีเมล** + **รหัสผ่าน**
2. กด **"เข้าสู่ระบบ"**
3. ระบบจะพาไปหน้า Profile

### ป้องกัน Brute Force:
- ระบบจำกัด **10 ครั้ง / 15 นาที** ต่ออีเมล
- ถ้าเกินจะ login ไม่ได้ ต้องรอ 15 นาที

---

## 1.3 หน้าแรก

**URL:** `/`

### องค์ประกอบจากบนลงล่าง:
1. **Hero Banner** — ภาพ One Piece + ปุ่ม "Explore Shop" / "Join Bounty Crew"
2. **Cloud Transition** — animation ก้อนเมฆ
3. **Grand Line Map** — แผนที่เกาะ One Piece + หมุดสินค้าแต่ละ set
   - Hover ที่หมุด → เห็นรูปกล่อง + ราคา
   - กดหมุด → ไปหน้าสินค้า
4. **Premium Cards** — การ์ด SEC/SR ที่มีมูลค่าสูง (3D tilt effect)
5. **Bounty Rank Section** — แสดง 4 rank + สิทธิพิเศษ
6. **Spin Wheel** — วงล้อลุ้นรางวัล (6 รางวัล)
7. **Footer** — ลิงก์ต่างๆ + ข้อมูลติดต่อ

---

## 1.4 ร้านค้า

**URL:** `/shop`

### ฟีเจอร์:
- **กรองสินค้า:**
  - ตาม Category: Booster / Extra Booster / Premium / Starter
  - ตาม Status: In Stock / Pre-Order / Sold Out
  - ค้นหาด้วยชื่อ
- **แสดงผล:**
  - รูปกล่อง + ชื่อ set + ราคา
  - สถานะ stock (สีเขียว = มีของ, สีเหลือง = Pre-order, สีแดง = หมด)
  - ปุ่ม "Add to Cart" (ถ้ามีของ)
- **Animation:**
  - Card hover → 3D tilt + holographic shimmer
  - Scroll → reveal animation

---

## 1.5 รายละเอียดสินค้า

**URL:** `/shop/[slug]` เช่น `/shop/romance-dawn`

### แสดงอะไรบ้าง:
1. **ข้อมูลกล่อง:**
   - ชื่อ set, รหัส (เช่น OP-01), ราคา, จำนวนคงเหลือ
   - จำนวนซอง/กล่อง, จำนวนใบ/ซอง
   - วันวางจำหน่าย
2. **ปุ่ม Add to Cart** — เลือกจำนวน + กดเพิ่มในตะกร้า
   - แสดง Loot Box animation เมื่อเพิ่มสำเร็จ
3. **Drop Rates** — แสดงโอกาสสุ่มแต่ละ rarity:
   - Leader, Secret Rare, Super Rare, Rare, Uncommon, Common
   - การ์ดตัวอย่างแต่ละ rarity
4. **Card Distribution** — รายการการ์ดทั้งหมดในกล่อง
   - **JP/EN Toggle** — สลับดูการ์ดภาษาญี่ปุ่น/อังกฤษ (default: JP เพราะขาย JP box)
   - Filter ตาม rarity
   - กดการ์ด → ไปหน้ารายละเอียดการ์ด
5. **Island Lore** — เนื้อเรื่อง One Piece ที่เกี่ยวกับ set นี้

---

## 1.6 ดูการ์ดในกล่อง

**URL:** `/cards` (ค้นหาทุก set) หรือ `/cards/[cardId]` (การ์ดเดี่ยว)

### Card Browser (`/cards`):
- ค้นหาด้วยชื่อการ์ด, รหัส, ประเภท
- รองรับ 1,000+ การ์ดจาก 19 sets

### Card Detail (`/cards/OP01-006`):
- **JP/EN Toggle** — สลับภาษาได้
- **Card Stats:** Type, Cost, Power, Counter, Life, Attribute
- **Card Effect** — ข้อความ ability
- **Market Price** — ราคาตลาด (USD)
- **Sub Types** — เผ่า/กลุ่ม
- **Version Switcher** — ถ้ามีหลาย art (ปกติ, Alt Art, Manga Rare)

---

## 1.7 ตะกร้าสินค้า + สั่งซื้อ

**URL:** `/cart`

### ขั้นตอนสั่งซื้อ:
1. **ดูตะกร้า** — เห็นรายการสินค้า, จำนวน, ราคารวม
   - ปรับจำนวน (+/-) หรือลบสินค้าได้
2. **ส่วนลดอัตโนมัติ:**
   - **Bounty Rank Discount** — ตาม rank ปัจจุบัน (0-8%)
   - **โบนัสชวนเพื่อน** — ออเดอร์แรก -3% (ถ้าสมัครด้วย referral code)
   - ส่วนลดซ้อนกันได้ (เช่น Paradise 3% + Referral 3% = 6%)
3. **กด "Checkout"** → กรอกข้อมูลจัดส่ง:
   - ชื่อผู้รับ, เบอร์โทร, ที่อยู่, จังหวัด, รหัสไปรษณีย์
   - หมายเหตุ (ไม่บังคับ)
4. **กด "Place Order"** → สร้างออเดอร์
5. **อัพโหลดสลิป** → ดูข้อ 1.8

### Order Summary แสดง:
```
Subtotal:                    ฿4,400
Bounty Rank (Paradise -3%):  -฿132
โบนัสชวนเพื่อน (-3%):        -฿132
─────────────────────────────
Total:                       ฿4,136
```

---

## 1.8 อัพโหลดสลิปโอนเงิน

### หลังสั่งซื้อเสร็จ:
1. โอนเงินตามยอดที่แสดง
2. กลับไปที่หน้า **Profile** → **Order History**
3. กดที่ออเดอร์ → กด **"Upload Slip"**
4. เลือกรูปสลิป (JPG/PNG/WebP, ไม่เกิน 5MB)
5. สถานะเปลี่ยนเป็น **"Payment Uploaded"**
6. รอแอดมินตรวจสอบ → สถานะจะเปลี่ยนตามขั้นตอน

### สถานะออเดอร์ (7 ขั้นตอน):
```
Pending → Payment Uploaded → Payment Confirmed → Packing → Shipped → Delivered
                                                                     ↗
                                                            Cancelled
```

---

## 1.9 โปรไฟล์สมาชิก

**URL:** `/profile`

### แสดงอะไรบ้าง:
1. **Header:** ชื่อ, อีเมล, เบอร์โทร, LINE ID, วันที่สมัคร
2. **Quick Stats:** จำนวนออเดอร์ + ยอดซื้อสะสม
3. **Bounty Rank:** rank ปัจจุบัน + progress bar ไป rank ถัดไป
4. **ลิงก์ "ดูสิทธิพิเศษทั้งหมด"** → ไปหน้า `/membership`
5. **ชวนเพื่อน:** โค้ด referral + ปุ่ม Copy + จำนวนคนที่ชวนมา
6. **Order History:** รายการออเดอร์ทั้งหมด + สถานะ

### แก้ไขข้อมูลได้:
- ชื่อที่แสดง, เบอร์โทร, LINE ID

---

## 1.10 Bounty Rank

**URL:** `/membership`

### วิธีทำงาน:
1. **ซื้อสินค้า** → ยอดสะสมนับอัตโนมัติ
2. **ถึงเกณฑ์** → Rank ขึ้นอัตโนมัติ (มี celebration animation)
3. **ไม่มีหมดอายุ** → Rank ตลอดชีพ

### Rank Tiers:
| Rank | ยอดซื้อ | ส่วนลด | สิทธิพิเศษหลัก |
|------|---------|--------|---------------|
| 🌊 East Blue | ฿0+ | 0% | สมาชิกพื้นฐาน |
| ⚓ Paradise | ฿5,000+ | 3% | Pre-order ก่อนใคร |
| 🔥 New World | ฿15,000+ | 5% | ส่งฟรี + ของแถม |
| 👑 Yonko | ฿50,000+ | 8% | VIP Event + Promo Card + LINE กลุ่มลับ |

### หน้า Membership แสดง:
- "ทำงานยังไง?" 3 ขั้นตอน
- การ์ด 4 rank พร้อม perks ทั้งหมด
- Progress bar แสดงระยะทางถึง rank ถัดไป
- CTA "เลือกซื้อสินค้า" + "สมัครสมาชิก"

---

## 1.11 ชวนเพื่อน

### สำหรับคนชวน:
1. ไปที่ **Profile** → เห็นกล่อง "ชวนเพื่อน"
2. มีโค้ดส่วนตัว เช่น `GG-K7NH3P`
3. กด **Copy** → แชร์ให้เพื่อน (LINE, IG, FB)
4. เห็นรายชื่อ + จำนวนเพื่อนที่ชวนมา

### สำหรับคนถูกชวน:
1. ได้รับโค้ดจากเพื่อน
2. สมัครสมาชิก → ใส่โค้ดในช่อง "โค้ดชวนเพื่อน"
3. ออเดอร์แรก → **ลด 3% อัตโนมัติ** (ซ้อนกับ Rank discount)

### แชร์ผ่าน Link:
```
https://yoursite.com/auth/register?ref=GG-K7NH3P
```
เพื่อนกดลิงก์ → โค้ดจะถูกใส่ให้อัตโนมัติ

---

## 1.12 Blog

**URL:** `/blog`

### บทความ 7 เรื่อง:
1. **คู่มือมือใหม่** — วิธีเล่น, สร้างเด็ค, เริ่มต้นซื้อ
2. **ประวัติ OPTCG** — จุดเริ่มต้นจนถึงปัจจุบัน
3. **ระบบ Rarity** — อธิบายทุก rarity + pull rates
4. **วงการแข่งขัน** — ทัวร์นาเมนต์ต่างๆ + ไทยซีน
5. **เทคนิคสะสมการ์ด** — grading, เก็บรักษา, ป้องกันของปลอม
6. **JP vs EN** — เปรียบเทียบราคา + คำแนะนำ
7. **ข่าวล่าสุด 2025-2026** — set ใหม่, Block Rotation

---

# ส่วนที่ 2: สำหรับแอดมิน

---

## 2.1 เข้า Admin Panel

**URL:** `/admin`

### วิธีเข้า:
1. Login ด้วยบัญชีที่มี role = ADMIN
2. กดที่ Navbar → "Admin Panel" (แสดงเฉพาะ admin)
3. หรือเข้า URL `/admin` โดยตรง

### Default Admin Account:
```
Email:    admin@luckytcgthailand.com
Password: (ตั้งไว้ใน .env ADMIN_PASSWORD)
```

### Menu (Sidebar):
- 📊 Dashboard
- 📦 Orders
- 🛍️ Products
- 👥 Customers
- ← Back to Store

---

## 2.2 Dashboard

**URL:** `/admin`

### แสดงสถิติ:
| ข้อมูล | รายละเอียด |
|--------|-----------|
| Total Revenue | ยอดขายรวมทั้งหมด (บาท) |
| Total Orders | จำนวนออเดอร์ทั้งหมด |
| Total Customers | จำนวนสมาชิก |
| Average Order Value | ยอดเฉลี่ยต่อออเดอร์ |

### ออเดอร์ล่าสุด:
- 10 ออเดอร์ล่าสุดพร้อมสถานะ
- กดเพื่อไปหน้ารายละเอียด

---

## 2.3 จัดการสินค้า (Products)

**URL:** `/admin/products`

### หน้ารายการสินค้า:

**ด้านบน:**
- ปุ่ม **"+ Add Product"** (สีทอง)
- Stats: Total | In Stock | Pre-Order | Sold Out | Low Stock

**Filter:**
- ค้นหาด้วยชื่อ/รหัส
- กรองตาม Status
- กรองตาม Category

**ตาราง:**
- รูป | ชื่อ + Code | Category | ราคา | Stock | Status | Edit
- Stock สีแดง = หมด, สีส้ม = เหลือน้อย (≤3), สีเขียว = มีของ
- กดที่แถว → เปิด Edit Modal

---

### เพิ่มสินค้าใหม่

1. กดปุ่ม **"+ Add Product"**
2. Modal เปิดขึ้น มี **4 tabs:**

#### Tab 1: Basic (ข้อมูลหลัก)
| Field | บังคับ | ตัวอย่าง |
|-------|--------|---------|
| Product Name | ✅ | Romance Dawn |
| Code | ✅ | OP-01 |
| Description | | ชุดแรกของ One Piece Card Game |
| Price per Box | ✅ | 2200 |
| Stock | | 10 |
| Status | | In Stock / Pre-Order / Sold Out |
| Category | | Booster / Extra / Premium / Starter |

#### Tab 2: Box (ข้อมูลกล่อง)
| Field | Default | หมายเหตุ |
|-------|---------|---------|
| Box Count | 1 | จำนวน box ต่อ unit |
| Packs per Box | 24 | จำนวนซองต่อกล่อง |
| Cards per Pack | 6 | จำนวนใบต่อซอง (JP = 6, EN = 12) |
| Release Date | | วันวางจำหน่าย |

#### Tab 3: Image (รูปสินค้า)
- **อัพโหลดรูป** — กด "Upload Image" → เลือกไฟล์ (JPG/PNG/WebP, max 5MB)
- **หรือใส่ URL** — พิมพ์ path เช่น `/images/sets/op01.png`
- แสดง preview รูปปัจจุบัน
- **หมายเหตุ:** อัพโหลดได้เฉพาะตอน Edit (สินค้าต้องสร้างก่อน)

#### Tab 4: Theme (ธีมเกาะ)
สำหรับแผนที่ Grand Line ในหน้าแรก:

| Field | ตัวอย่าง | หมายเหตุ |
|-------|---------|---------|
| Island Name | Foosha Village | ชื่อเกาะ |
| Color | #e74c3c | สีหมุดบนแผนที่ (มี color picker) |
| Arc Name | Romance Dawn Arc | ชื่อ arc |
| Island Description | หมู่บ้านริมทะเล... | คำอธิบาย |
| Gradient Classes | from-red-900 via-red-700 to-orange-500 | Tailwind gradient |
| Key Characters | Monkey D. Luffy, Shanks | ตัวละครสำคัญ (tag input) |

3. กด **"Create Product"** → สินค้าถูกสร้าง
4. ระบบ auto-generate slug จากชื่อ (เช่น "Romance Dawn" → "romance-dawn")

---

### แก้ไขสินค้า

1. กดที่แถวสินค้า หรือปุ่ม "Edit"
2. Modal เปิดขึ้น → แก้ไขทุก field ได้
3. กด **"Save Changes"**

### ลบสินค้า

1. เปิด Edit Modal
2. กดปุ่ม **"Delete"** (สีแดง ด้านล่างซ้าย)
3. ระบบถาม **"Confirm delete?"** → กด "Yes, Delete"

⚠️ **ลบไม่ได้ถ้าสินค้ามีออเดอร์อยู่** — ระบบจะแจ้ง error ให้เปลี่ยนเป็น "Sold Out" แทน

---

## 2.4 จัดการออเดอร์ (Orders)

**URL:** `/admin/orders`

### หน้ารายการออเดอร์:
- ค้นหาด้วยเลขออเดอร์ / ชื่อลูกค้า
- กรองตาม Status
- แสดง: เลขออเดอร์, ลูกค้า, ยอดเงิน, สถานะ, วันที่

### หน้ารายละเอียดออเดอร์ (`/admin/orders/[orderId]`):

**แสดงข้อมูล:**
1. **ข้อมูลลูกค้า:** ชื่อ, อีเมล, rank
2. **สินค้า:** รายการ + จำนวน + ราคา
3. **ส่วนลด:** แสดงว่าใช้ rank อะไร + referral หรือเปล่า
4. **ที่อยู่จัดส่ง:** ชื่อผู้รับ, เบอร์, ที่อยู่เต็ม
5. **สลิปโอนเงิน:** รูปสลิป (ถ้ามี)

### Flow การจัดการออเดอร์:

```
1. ลูกค้าสั่งซื้อ            → สถานะ: PENDING
2. ลูกค้าอัพสลิป             → สถานะ: PAYMENT_UPLOADED
3. แอดมินตรวจสลิป ✓          → สถานะ: PAYMENT_CONFIRMED
4. แอดมินแพ็คสินค้า           → สถานะ: PACKING
5. แอดมินส่งของ + ใส่ tracking → สถานะ: SHIPPED
6. ของถึง                     → สถานะ: DELIVERED
```

### ตรวจสอบการชำระเงิน:
1. เปิดออเดอร์ที่มีสถานะ "Payment Uploaded"
2. ดูรูปสลิปโอนเงิน
3. ถ้าถูกต้อง → กด **"Verify Payment"** → สถานะเปลี่ยนเป็น PAYMENT_CONFIRMED
4. ถ้าไม่ถูกต้อง → กด **"Reject"** → แจ้งลูกค้าโอนใหม่

### อัพเดทสถานะ:
- เลือกสถานะใหม่จาก dropdown
- ใส่ **Tracking Number** เมื่อส่งของ
- กด **"Update Status"**

---

## 2.5 จัดการลูกค้า (Customers)

**URL:** `/admin/customers`

### หน้ารายการลูกค้า:

**Stats ด้านบน:**
- Total Revenue (ยอดขายรวม)
- Total Members (จำนวนสมาชิก)
- New Members (สมัครใน 30 วัน)
- จำนวนสมาชิกแต่ละ rank

**ตาราง:**
- Rank Badge | ชื่อ | อีเมล | Rank | ยอดซื้อ | จำนวนออเดอร์ | วันสมัคร

**ค้นหา:**
- ค้นด้วยชื่อหรืออีเมล
- Pagination (25 คน/หน้า)

### รายละเอียดลูกค้า (Modal):

**Tab 1: Overview**
- Rank progress (แสดงทุก rank ที่ผ่านมา + ที่ยังไม่ถึง)
- ข้อมูลส่วนตัว (แก้ไขได้): ชื่อ, อีเมล, เบอร์, LINE ID
- Quick stats: ยอดซื้อรวม, จำนวนออเดอร์, ยอดเฉลี่ย

**Tab 2: Orders**
- ประวัติออเดอร์ทั้งหมดของลูกค้า
- สถานะ + ยอดเงิน + ส่วนลด

**Tab 3: Addresses**
- ที่อยู่จัดส่งที่ลูกค้าบันทึกไว้
- เห็นที่อยู่ default

---

## 2.6 Flow การทำงานประจำวัน

### เช้า: เช็คออเดอร์ใหม่
```
1. เข้า /admin → ดู Dashboard
2. ไปที่ Orders → กรอง "Payment Uploaded"
3. ตรวจสลิปทีละออเดอร์
4. ถูกต้อง → "Verify Payment"
5. ไม่ถูกต้อง → "Reject" + แจ้งลูกค้า
```

### บ่าย: แพ็คและส่งของ
```
1. กรอง Orders → "Payment Confirmed"
2. แพ็คสินค้า → อัพเดทเป็น "Packing"
3. ส่งของ → ใส่ Tracking Number → อัพเดทเป็น "Shipped"
```

### เพิ่มสินค้าใหม่
```
1. ไปที่ Products → "+ Add Product"
2. กรอกข้อมูล Tab 1-4
3. "Create Product"
4. เปิด Edit → Tab Image → อัพโหลดรูป
```

### อัพเดท Stock
```
1. ไปที่ Products → กดที่สินค้า
2. แก้ Stock → "Save Changes"
3. ถ้าของหมด → เปลี่ยน Status เป็น "Sold Out"
```

### เช็คสมาชิก
```
1. ไปที่ Customers
2. ดู New Members (30 วัน)
3. ดู Rank distribution
4. กดที่ลูกค้า → ดูประวัติการซื้อ
```

---

# ส่วนที่ 3: การตั้งค่าระบบ

---

## 3.1 Environment Variables

สร้างไฟล์ `.env` จาก `.env.example`:

```bash
# Database
DATABASE_URL=postgresql://goodguy:password@localhost:5433/luckytcgthailand

# Auth
AUTH_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    # สร้างด้วย: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000             # URL ของเว็บ

# LINE OAuth (ไม่บังคับ)
AUTH_LINE_ID=your_line_channel_id
AUTH_LINE_SECRET=your_line_channel_secret

# Admin seed
ADMIN_EMAIL=admin@luckytcgthailand.com
ADMIN_PASSWORD=your_secure_password

# Docker
POSTGRES_DB=luckytcgthailand
POSTGRES_USER=goodguy
POSTGRES_PASSWORD=your_db_password
APP_PORT=3000
```

---

## 3.2 Seed ข้อมูลเริ่มต้น

```bash
# 1. Start database
docker-compose up -d db

# 2. Create tables
npx prisma db push

# 3. Seed products + admin
npx tsx prisma/seed.ts
```

### Seed สร้างอะไร:
- **Admin account** (จาก ADMIN_EMAIL + ADMIN_PASSWORD ใน .env)
- **สินค้า 20+ รายการ** (OP-01 ถึง OP-15, EB-01-03, PRB-01-02)
- ข้อมูล Island Theme สำหรับแผนที่

---

## 3.3 สร้าง Admin Account

### วิธีที่ 1: ผ่าน Seed Script
- ตั้ง `ADMIN_EMAIL` + `ADMIN_PASSWORD` ใน `.env`
- รัน `npx tsx prisma/seed.ts`

### วิธีที่ 2: เปลี่ยน role ใน Database
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'target@email.com';
```

### วิธีที่ 3: ผ่าน Prisma Studio
```bash
npx prisma studio
# เปิด browser → เลือก User → เปลี่ยน role เป็น ADMIN
```

---

## 3.4 Docker

### Development
```bash
# Start ทั้งหมด (DB + App)
docker-compose up -d

# Start เฉพาะ DB
docker-compose up -d db

# ดู logs
docker-compose logs -f app

# หยุด
docker-compose down
```

### Production Build
```bash
# Build image
docker build -t luckytcgthailand .

# Run
docker run -p 3000:3000 --env-file .env luckytcgthailand
```

### Port ที่ใช้:
| Service | Port |
|---------|------|
| Next.js App | 3000 |
| PostgreSQL | 5433 |

---

## FAQ (คำถามที่พบบ่อย)

### Q: ลูกค้าลืมรหัสผ่านทำไง?
A: ยังไม่มีระบบ reset password อัตโนมัติ → แอดมินต้อง reset ใน DB หรือแนะนำให้สมัครใหม่

### Q: เปลี่ยนราคาสินค้ามีผลกับออเดอร์เก่าไหม?
A: ไม่มีผล — ราคาถูกบันทึกไว้ใน OrderItem ตอนสั่งซื้อ

### Q: ลบสินค้าไม่ได้?
A: ถ้าสินค้ามีออเดอร์ ระบบป้องกันไม่ให้ลบ → ให้เปลี่ยนเป็น "Sold Out" แทน

### Q: Rank ลดได้ไหม?
A: ไม่ได้ — Rank เป็นแบบตลอดชีพ ขึ้นได้อย่างเดียว

### Q: อัพโหลดรูปสินค้าตอนเพิ่มใหม่ได้เลยไหม?
A: ต้องสร้างสินค้าก่อน แล้วค่อย Edit → Tab Image → อัพโหลด (เพราะต้องมี ID สำหรับ save)

### Q: Referral discount ใช้ได้กี่ครั้ง?
A: 1 ครั้ง — เฉพาะออเดอร์แรกเท่านั้น

### Q: ไฟล์รูปเก็บที่ไหน?
A: อยู่ใน `/public/uploads/` (products/ + slips/) — ถ้าใช้ Docker ต้อง mount volume เพื่อไม่ให้หายตอน restart

---

> 📝 เอกสารนี้สร้างสำหรับ LUCKY TCG THAILAND Store v0.1.0
> สอบถามเพิ่มเติม: LINE @luckytcgthailand
