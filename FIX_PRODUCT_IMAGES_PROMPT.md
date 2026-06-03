# Cursor Prompt — Fix broken product images on catalog cards

**Copy everything below into Cursor Agent.**

---

## Problem

Product cards on the catalog (`/`) show **empty mint/teal squares** instead of images. The browser/terminal shows this Next.js error repeatedly:

```text
The requested resource "https://placehold.co/400x400/e2e8f0/0d9488?text=..." 
has type "image/svg+xml" but dangerouslyAllowSVG is disabled. 
Consider adding the "unoptimized" property to the <Image>.
```

**Root cause:** Seed and components use `placehold.co` URLs that return **SVG**. `next/image` blocks SVG by default, so images fail silently and only the card background (`bg-muted`) is visible.

**Screenshot reference:** Broken image icon in the corner of the placeholder area; titles and SYP prices render correctly.

---

## Goal

All product images must render reliably in:

- `components/shop/product-card.tsx`
- `app/products/[id]/page.tsx` (main image + thumbnails)
- `app/cart/page.tsx`
- Any admin list that uses `next/image`

No console errors for image loading on catalog navigation.

---

## Required fix (preferred — do all steps)

### 1) Force PNG placeholders (not SVG)

Update **every** `placehold.co` URL in the repo (especially `prisma/seed.ts` and fallbacks in components) to PNG format, e.g.:

```text
https://placehold.co/400x400/png/e2e8f0/0d9488?text=منتج
```

Or use an equivalent placehold.co PNG URL documented in their API. **Do not** leave URLs that return `image/svg+xml`.

Re-run seed after changing URLs:

```bash
npx prisma db seed
```

### 2) Create a shared `ProductImage` component

Create `components/shop/product-image.tsx`:

- Wraps `next/image` with consistent props: `fill`, `className="object-cover"`, `sizes` for grid.
- Default `src` fallback: `/images/product-placeholder.png` (add a simple static PNG under `public/images/`).
- `onError` handler: if remote image fails, switch to local placeholder (use state).
- For known demo hosts (`placehold.co`, `picsum.photos`), you may set `unoptimized` only if still needed after PNG fix — prefer PNG first.

Replace raw `<Image>` in `product-card.tsx`, product detail page, and cart with `<ProductImage />`.

### 3) Keep `next.config.ts` safe

`remotePatterns` for `placehold.co` is already present — keep it.

**Do not** enable `dangerouslyAllowSVG` unless PNG migration still fails; PNG is the preferred fix.

Optional: add `images.formats: ['image/avif', 'image/webp']` only if it does not break placeholders.

### 4) Local placeholder asset

Add `public/images/product-placeholder.png` (400×400, light teal `#e2e8f0` background, subtle “منتج” text or generic icon). Use when `images[]` is empty or load fails.

### 5) Verify

After changes:

1. `npm run dev` — open `http://localhost:3000`
2. Confirm catalog cards show images (not empty squares)
3. Open product detail — gallery works
4. Add to cart — cart line thumbnail works
5. Terminal must have **zero** `dangerouslyAllowSVG` / `image/svg+xml` errors when browsing categories

Run `npm run build` and fix any TypeScript or image config errors.

---

## Acceptance criteria

- [ ] Catalog grid displays visible product images for all seeded products
- [ ] Out-of-stock card (grayed) still shows image + “غير متوفر” badge
- [ ] No `image/svg+xml` errors in server terminal during catalog browse
- [ ] Single reusable `ProductImage` component with local fallback
- [ ] Seed URLs updated to PNG; DB re-seeded if needed

---

## Out of scope

- Replacing all placeholders with real product photography
- Changing pricing, cart, or WhatsApp flow
- The black “N” circle in the screenshot corner (Cursor/IDE UI) — ignore unless it exists in project code

---

## Files likely to touch

- `components/shop/product-card.tsx`
- `components/shop/product-image.tsx` (new)
- `app/products/[id]/page.tsx`
- `app/cart/page.tsx`
- `prisma/seed.ts`
- `next.config.ts` (only if required)
- `public/images/product-placeholder.png` (new)

---

**Implement the fix now in this workspace. Do not ask questions unless a file path differs — search for `placehold.co` across the repo and update all occurrences.**
