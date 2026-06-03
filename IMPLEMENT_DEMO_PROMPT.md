# Implementation Prompt (English) — Copy into Cursor Agent

Use this file as the single source of truth. For the full specification, see **`PROMPT_EN.md`**.

---

**Role:** Senior full-stack developer. Build a complete runnable demo in this workspace from scratch.

**Goal:** B2B wholesale beauty catalog — fast, mobile-first, Arabic RTL, Teal + white. Orders complete via WhatsApp (not a payment checkout store).

**Start now.** Do not ask clarifying questions unless blocked. Document defaults in README.

---

## Quick invoke (paste in Cursor)

```
Read PROMPT_EN.md and implement the entire demo in this workspace.
Follow every section. Run npm run build before finishing.
```

---

## Stack

- Next.js 15 + TypeScript + Tailwind + shadcn/ui
- Prisma + SQLite
- Zustand (cart + customer fields)
- exceljs (import/export)
- Admin: env `ADMIN_USER` / `ADMIN_PASSWORD`, session cookie

Single app: `/` = shop, `/admin` = dashboard.

---

## Core features checklist

| Area | Must have |
|------|-----------|
| Shop | Categories, product cards, detail page, variant qty batch add, cart, checkout |
| Pricing | USD in admin, SYP for customers, exchange rate, round to 500 or 1000 SYP |
| Stock | hide / disable / grayed when out of stock |
| Customer | Save name, phone, address in localStorage |
| WhatsApp | Structured Arabic order message; number from admin settings |
| Admin | Product/category CRUD, variants, bulk % price, settings, Excel in/out |

---

## Pricing formula

```
raw = priceUsd * usdToSypRate
rounded = round(raw / step) * step   // step = 500 or 1000
```

Customer sees rounded SYP only.

---

## Seed highlights

- 20+ products, 5+ Arabic categories
- Natural soap with variants: فحم، نعناع، صبار
- Three OOS behavior demo products + one hidden product
- Default rate: 15000, rounding: 1000

---

## Done when

- [ ] `npm run dev` and `npm run build` succeed
- [ ] All items in PROMPT_EN.md §13 acceptance criteria pass
- [ ] Arabic README with setup + admin login

**Full details: `PROMPT_EN.md`**
