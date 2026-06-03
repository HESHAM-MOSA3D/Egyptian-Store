# Cursor Prompt — Implement Wholesale Beauty Catalog Demo (Full Spec)

> **Objective:** Build a fast, client-ready **demo** in this workspace. Clean, extensible code. UI should look near-production (not a wireframe). **Start implementing immediately.** Do not ask questions unless truly blocked—pick defaults, document them in README.

---

## 1) Project context

Build a **smart wholesale order catalog** (not a traditional e-commerce store) for a center trading beauty and personal-care products.

| Aspect | Requirement |
|--------|-------------|
| Audience | Shop and pharmacy customers + optional delivery |
| Priority | Speed, ease of use, low input burden, excellent mobile UX |
| Branding | Calm **Teal (petrol green)** + **white**, clear Arabic font (Cairo or Tajawal) |
| Customer prices | Display **Syrian Pound (SYP)** only |
| Admin prices | Enter **USD** in dashboard; configurable **exchange rate**; auto SYP with **rounding** (see §6) |
| UI language | **Arabic RTL** everywhere (`dir="rtl"`, `lang="ar"`) |
| Order flow | Cart → lightweight checkout → **WhatsApp** (no payment gateway) |

**Hosting note (architecture):** Production target is **Hostinger Shared** (no VPS). Design a clean REST API layer so the demo (Next.js + SQLite) can later migrate to **PHP + MySQL** on shared hosting. Keep pricing/stock logic in framework-agnostic services.

---

## 2) Tech stack (use this)

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) + TypeScript strict |
| Styling | Tailwind CSS + `next/font` (Cairo or Tajawal) |
| UI | shadcn/ui (minimal set) |
| Database | SQLite + Prisma |
| Client state | Zustand (cart + checkout customer fields) |
| Excel | `exceljs` |
| Admin auth | Middleware + `.env`: `ADMIN_USER`, `ADMIN_PASSWORD` |
| Tests | `pricing.ts` unit tests (vitest or node:test) |

**Single app:** customer at `/`, admin at `/admin/*`.

Do **not** use UI-only mock data—every screen reads from API + DB.

---

## 3) Execution order

1. Scaffold Next.js in workspace root.
2. Prisma schema → migrate → seed (§8).
3. `lib/pricing.ts` + tests.
4. `lib/stock.ts` — availability + out-of-stock behavior.
5. API routes (`app/api/`).
6. Customer UI: catalog → product → cart → checkout.
7. Admin UI: login, dashboard, CRUD, bulk pricing, settings, Excel.
8. Arabic `README.md` + `.env.example`.
9. `npm run build` — zero errors before done.

---

## 4) Data model (Prisma)

```prisma
enum OutOfStockBehavior { HIDE DISABLE GRAYED }
enum RoundingMode { NEAREST_500 NEAREST_1000 }

model Category {
  id        String    @id @default(cuid())
  nameAr    String
  slug      String    @unique
  sortOrder Int       @default(0)
  isActive  Boolean   @default(true)
  products  Product[]
}

model Product {
  id                 String             @id @default(cuid())
  categoryId         String
  category           Category           @relation(fields: [categoryId], references: [id])
  nameAr             String
  descriptionAr      String?
  images             String             // JSON array of URLs
  priceUsd           Float
  stockQty           Int                @default(0)  // used when hasVariants = false
  hasVariants        Boolean            @default(false)
  isActive           Boolean            @default(true)
  isHidden           Boolean            @default(false)
  outOfStockBehavior OutOfStockBehavior @default(GRAYED)
  variants           ProductVariant[]
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt
}

model ProductVariant {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  labelAr   String  // e.g. charcoal, mint, aloe
  sku       String?
  priceUsd  Float?  // null → use product.priceUsd
  stockQty  Int     @default(0)
  sortOrder Int     @default(0)
  isActive  Boolean @default(true)
}

model Settings {
  id             String       @id @default("singleton")
  storeNameAr    String       @default("مركز التجميل")
  usdToSypRate   Float        @default(15000)
  roundingMode   RoundingMode @default(NEAREST_1000)
  whatsappNumber String       @default("963900000000") // digits only, no +
  deliveryNoteAr String?
}
```

**Optional for demo:** `Order` model to log WhatsApp-sent orders (not required if out of scope).

**Customer profile:** persist in `localStorage` only (`name`, `phone`, `address`, `notes`, `deliveryRequested`).

---

## 5) Stock & availability rules

- **With variants:** in stock if any active variant has `stockQty > 0`.
- **Without variants:** use `product.stockQty`.
- **Fully out of stock** → apply `outOfStockBehavior`:
  - `HIDE` — exclude from public product lists/API
  - `DISABLE` — visible, cannot add to cart
  - `GRAYED` — visible dimmed + Arabic badge **"غير متوفر"**
- Admin: auto-detect OOS; show badge **"نفد"** + filter **out of stock**.
- Block cart qty > available stock with clear Arabic message.

---

## 6) Pricing & rounding (mandatory — test it)

```ts
// lib/pricing.ts
export function usdToSyp(
  priceUsd: number,
  rate: number,
  mode: 'NEAREST_500' | 'NEAREST_1000'
): number {
  const raw = priceUsd * rate;
  const step = mode === 'NEAREST_500' ? 500 : 1000;
  return Math.round(raw / step) * step;
}
```

- Customer always sees **rounded SYP** (e.g. `150,000 ل.س`).
- Admin edits **USD**; show live **computed SYP** preview on forms.
- Changing exchange rate in settings recalculates all displayed SYP (no per-product manual update).
- Line total = `usdToSyp(unitPriceUsd) × quantity`.
- Cart grand total = sum of line totals.

**Test cases in seed/docs:**
- 10 USD × 15,000 = 150,000 → round 1000 → **150,000**
- 10 USD × 15,250 = 152,500 → round 1000 → **153,000**; round 500 → **152,500**

---

## 7) API routes

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/categories` | Active only |
| GET | `/api/products?category=&q=` | Apply HIDE for OOS; respect `isHidden` |
| GET | `/api/products/[id]` | Detail + variants + computed SYP |
| GET | `/api/settings` | Public: store name, whatsapp (for checkout), rate, rounding |
| POST | `/api/admin/login` | Set HTTP-only session cookie |
| POST | `/api/admin/logout` | Clear session |
| CRUD | `/api/admin/categories` | Protected |
| CRUD | `/api/admin/products` | Nested variant save/delete |
| POST | `/api/admin/products/bulk-price` | `{ percent: number, categoryId?, productIds? }` |
| GET | `/api/admin/settings` | Full settings |
| PUT | `/api/admin/settings` | Exchange rate, rounding, WhatsApp, store name |
| GET | `/api/admin/export` | Download `.xlsx` |
| POST | `/api/admin/import` | Upload → validate → preview → apply |

Protect all `/api/admin/*` except login with middleware.

---

## 8) Customer front-end (Arabic RTL)

### 8.1 Catalog `/`
- Sticky header: store name, search, cart icon + item count.
- Horizontal scroll **category chips**: skin care, hair, perfumes, creams, makeup, tools, etc.
- Product **card grid**: image, name, SYP price (or **"من X ل.س"** if variant prices differ), OOS badge.
- Skeleton loaders + Arabic empty states.

### 8.2 Product card states
- `HIDE` when OOS → not in list.
- `DISABLE` → visible, no add-to-cart.
- `GRAYED` → muted card + **غير متوفر**.

### 8.3 Product detail `/products/[id]`
- Image gallery (swiper or thumbnails).
- Full Arabic description.
- **If `hasVariants`:**
  - Row per variant: label, unit SYP, stock, qty stepper (0 allowed).
  - Button **"إضافة المحدد للسلة"** — add all rows with qty > 0 in one action.
- **If no variants:** single qty + **"أضف إلى السلة"**.
- Prevent qty > stock.

### 8.4 Cart `/cart`
- Lines: product name, variant label, qty, unit SYP, line total.
- Edit qty / remove line.
- Grand total SYP.
- CTA **"إتمام الطلب"**.

### 8.5 Checkout `/checkout`
- Fields: **الاسم**, **الهاتف** (basic validation), **العنوان**, **ملاحظات**.
- Checkbox: **التوصيل مطلوب**.
- Auto-save to `localStorage`; restore on return.
- Button **"إرسال الطلب عبر واتساب"** → build message → open WhatsApp.

### 8.6 WhatsApp integration

```
https://wa.me/{whatsappNumber}?text={encodeURIComponent(message)}
```

**Message template (Arabic):**

```
🛒 طلب جديد — {storeNameAr}
────────────────
👤 الاسم: {name}
📞 الهاتف: {phone}
📍 العنوان: {address}
🚚 توصيل: {نعم / لا}
📝 ملاحظات: {notes}

📦 تفاصيل الطلب:
1) {productName} — {variantLabel} × {qty} = {lineTotal} ل.س
...
────────────────
💰 الإجمالي: {totalSyp} ل.س
🕐 {datetime ar-SY locale}
```

WhatsApp number must come from **Settings** (editable in admin).

### 8.7 Mobile & performance
- Mobile-first; 44px min tap targets.
- Lazy-load images.
- Order path in **≤ 3 taps** from catalog (category → product → cart is ok; checkout is 4th).

---

## 9) Admin dashboard `/admin`

### 9.1 Login `/admin/login`
- Credentials from `.env` (default demo: `admin` / `demo123`).
- No OAuth for demo.

### 9.2 Dashboard home
- Stats: total products, out-of-stock count, categories.
- Quick links: products, categories, bulk pricing, settings, import/export.

### 9.3 Categories CRUD
- Fields: `nameAr`, `slug`, `sortOrder`, `isActive`.

### 9.4 Products CRUD
- List filters: category, active, out of stock, hidden.
- Form: `nameAr`, `descriptionAr`, category, image URLs (multi), `priceUsd`, `hasVariants`, `stockQty` (if no variants), `outOfStockBehavior`, `isActive`, `isHidden`.
- **Variant editor:** dynamic rows — `labelAr`, `priceUsd?`, `stockQty`, `sku`, add/remove rows.

### 9.5 Bulk price update `/admin/products/bulk`
- Input: percentage (+10, -5, etc.).
- Scope: **all products** | **one category** | **selected products** (checkboxes).
- Preview affected count → confirm → multiply `priceUsd` on products and variant overrides.

### 9.6 Settings `/admin/settings`
- `usdToSypRate`, `roundingMode` (500 / 1000), `whatsappNumber`, `storeNameAr`, `deliveryNoteAr`.

### 9.7 Excel import / export
- **Export columns:** `productId`, `productNameAr`, `categorySlug`, `variantLabel`, `priceUsd`, `stockQty`, `isActive`
- **Import flow:** upload → validate → show row errors → confirm → upsert by `productId` + `variantLabel` or `sku`.

---

## 10) Seed data (required)

`prisma db seed` with **20+ products** in **5+ categories**:

| Category (Arabic) | Sample products |
|-------------------|-----------------|
| عناية بالبشرة | creams, serums |
| الشعر | shampoo with size/type variants |
| العطور | scent variants |
| الكريمات | body lotion (no variants) |
| الصابون الطبيعي | one product, variants: **فحم، نعناع، صبار** (one variant OOS) |
| مكياج | lipstick color variants |

**Must include:**
- 1 product demonstrating `HIDE` when OOS
- 1 product demonstrating `DISABLE` when OOS
- 1 product demonstrating `GRAYED` when OOS
- 1 `isHidden: true` product (admin only)
- Default settings: rate `15000`, rounding `NEAREST_1000`, WhatsApp `963911223344`

Images: `https://placehold.co/400x400/e2e8f0/0d9488?text=منتج`

---

## 11) Design tokens

```css
--primary: #0d9488;
--primary-dark: #0f766e;
--background: #ffffff;
--muted: #f0fdfa;
--text: #134e4a;
```

Calm, professional, not flashy.

---

## 12) Folder structure

```
app/
  (shop)/page.tsx, products/[id], cart, checkout
  admin/login, dashboard, categories, products, products/bulk, settings, import
  api/...
components/shop/, components/admin/, components/ui/
lib/pricing.ts, prisma.ts, auth.ts, stock.ts, whatsapp.ts
prisma/schema.prisma, seed.ts
tests/pricing.test.ts
README.md
.env.example
```

---

## 13) Acceptance criteria (all required)

- [ ] `npm install && npx prisma migrate dev && npx prisma db seed && npm run dev` works
- [ ] `npm run build` passes with no TypeScript errors
- [ ] Arabic RTL, Teal + white, responsive at 375px width
- [ ] Browse by category, search, cards, product detail
- [ ] Multi-variant qty + batch add to cart
- [ ] OOS: hide / disable / grayed all work
- [ ] Customer data saved in localStorage
- [ ] WhatsApp order with formatted Arabic message
- [ ] Admin: categories + products + variants CRUD
- [ ] Admin: exchange rate + rounding 500/1000
- [ ] Admin: bulk % price by scope
- [ ] Admin: Excel export + import
- [ ] Admin: editable WhatsApp number
- [ ] Clean code: shared types, isolated pricing/stock services
- [ ] README (Arabic): setup, credentials, feature overview, Hostinger/PHP migration note

---

## 14) Out of scope (document in README only)

- Payment gateway
- GPS delivery tracking
- Native mobile app
- Multi-tenant
- Complex RBAC (single admin user is enough)

---

## 15) Definition of done

When finished, report:

1. Commands to run locally
2. URLs: shop + admin
3. Admin credentials
4. **5-step demo script** for the client
5. Assumptions made

---

## 16) Client-facing note (for README)

> This demo shows the full order journey from catalog to WhatsApp, with an admin panel for USD pricing, automatic SYP conversion, and clean rounding. Production on Hostinger Shared may use PHP/MySQL—the project documents the migration path.

---

**Implement the full demo in this workspace now. Do not stop at partial scaffolding.**
