# قائمة تحقق النشر للإنتاج

دليل عربي خطوة بخطوة لنشر **كتالوج الجملة** (Next.js 15 + Prisma + SQLite) **دون حذف أي ميزة**: لوحة الإدارة، API، Excel، واتساب، حسابات التجار.

> **تنبيه أساسي:** الاستضافة المشتركة **الثابتة أو PHP فقط** (رفع `public_html` بدون Node) **لا تكفي**. التطبيق يحتاج **عملية Node.js تعمل باستمرار** (`npm start`).

---

## مراجع سريعة

| الملف | الغرض |
|--------|--------|
| [`.env.production.example`](./.env.production.example) | قالب متغيرات الإنتاج |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | تفاصيل Hostinger ومتغيرات البيئة |
| [`README.md`](./README.md) | تشغيل محلي وبيانات demo |
| `npm run deploy:checklist` | طباعة قائمة مختصرة في الطرفية |

---

## 1. ما قبل النشر (محلياً أو CI)

### 1.1 متطلبات

- [ ] **Node.js 20+** و **npm**
- [ ] المستودع كاملاً (بدون حذف `app/api` أو Prisma)

### 1.2 بناء ناجح

```bash
npm ci
npm run clean    # اختياري — إن وُجد تعارض مع dev على Windows
npm run build
```

- [ ] `npm run build` ينتهي **بدون أخطاء** (يشغّل `postbuild` → `prisma generate` تلقائياً)

### 1.3 أسرار الإنتاج (لا تترك الافتراضي)

انسخ [`.env.production.example`](./.env.production.example) إلى `.env` **على الخادم فقط**:

| المتغير | مطلوب | ملاحظة |
|---------|--------|--------|
| `DATABASE_URL` | نعم | مسار **مطلق** لملف SQLite دائم وقابل للكتابة |
| `ADMIN_USER` | نعم | ليس `admin` فقط إن أمكن |
| `ADMIN_PASSWORD` | نعم | **كلمة قوية عشوائية** — ليس `demo123` |
| `CUSTOMER_SESSION_SECRET` | نعم | سر طويل مستقل (الاسم في الكود؛ README يذكر أحياناً `SESSION_SECRET`) |
| `PORT` | حسب المنصة | من لوحة الاستضافة |
| `NODE_ENV` | تلقائي | `production` عند `npm start` |

- [ ] `ADMIN_PASSWORD` و `CUSTOMER_SESSION_SECRET` **مغيّران** عن التطوير
- [ ] ملف `.env` **غير مرفوع** إلى Git

### 1.4 Seed على السيرفر الحقيقي

- [ ] **لا** تشغّل `npx prisma db seed` على إنتاج حقيقي (بيانات عملاء حقيقية)
- Seed **معطّد تلقائياً** عند `NODE_ENV=production` ما لم تضبط `ALLOW_SEED=true` (للسيرفر التجريبي فقط)

### 1.5 نسخ احتياطي

- [ ] خطة نسخ احتياطي **أسبوعي** (أو يومي) لملف `.db`
- [ ] قبل كل نشر: نسخة من قاعدة الإنتاج الحالية

---

## 2. أوامر النشر القياسية (على الخادم)

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
# لا seed على إنتاج حقيقي
npm run build
npm run start:prod
```

أو دفعة واحدة (بعد ضبط `.env`):

```bash
npm run deploy:prepare
npm run start:prod
```

| الأمر | الوظيفة |
|--------|---------|
| `npm run db:migrate:deploy` | تطبيق migrations (إنتاج) |
| `npm run deploy:prepare` | generate + migrate deploy + build |
| `npm run start:prod` | تشغيل `next start` (نفس `npm start`) |
| `npm run deploy:checklist` | طباعة قائمة تحقق في الطرفية |

---

## 3. مسارات النشر (اختر واحداً)

### المسار أ) Hostinger مع Node.js

**مناسب إن:** خطتك تدعم **Node.js Web App** أو Git deploy + Node.

**لا يعمل إن:** الاستضافة **PHP/ملفات ثابتة فقط**.

#### الخطوات

1. [ ] تفعيل تطبيق Node **20+** من لوحة Hostinger
2. [ ] ربط المستودع أو رفع المشروع عبر SSH
3. [ ] إنشاء مجلد **دائم** لقاعدة البيانات، مثلاً:
   ```env
   DATABASE_URL="file:/home/USER/domains/DOMAIN.com/data/production.db"
   ```
4. [ ] ضبط متغيرات البيئة في اللوحة (`ADMIN_*`, `CUSTOMER_SESSION_SECRET`, `DATABASE_URL`, `PORT`)
5. [ ] أمر البناء (إن وُجد): `npm ci && npm run deploy:prepare`
6. [ ] أمر التشغيل: `npm run start:prod` أو `npm start`
7. [ ] تفعيل **HTTPS** (للكوكيز `secure` في الإنتاج)
8. [ ] `PORT` كما تحدده اللوحة — لا تفترض 3000 دائماً
9. [ ] جدولة نسخ احتياطي لملف `.db` (cron أو يدوي)

**مخاطر SQLite:** إعادة النشر على مجلد جديد دون نقل ملف `.db` **تفقد البيانات**.

---

### المسار ب) Railway أو Render

**مناسب لـ:** Next.js + Node دائم + قرص دائم أو ترحيل لاحق لـ Postgres.

#### Render (مثال)

1. [ ] New **Web Service** → ربط Git
2. [ ] Runtime: Node 20
3. [ ] Build: `npm ci && npm run deploy:prepare`
4. [ ] Start: `npm run start:prod`
5. [ ] **Disk / Persistent Volume** وربطه بمسار مثل `/data`
6. [ ] `DATABASE_URL="file:/data/production.db"`
7. [ ] متغيرات البيئة + HTTPS تلقائي
8. [ ] نسخ احتياطي للـ Volume أو تصدير `.db`

#### Railway (مثال)

1. [ ] مشروع جديد من GitHub
2. [ ] متغيرات البيئة (نفس القائمة أعلاه)
3. [ ] Volume مُرفق بمسار ثابت لـ SQLite
4. [ ] Deploy يشغّل `deploy:prepare` ثم `start:prod`

**لاحقاً (اختياري):** PostgreSQL على نفس المنصة — يتطلب تغيير `schema.prisma` ومشروع ترحيل منفصل.

---

### المسار ج) Vercel

**مناسب لـ:** Next.js وCDN وserverless API.

**تحذير حاسم:** **SQLite على ملف محلي لا يصلح للإنتاج على Vercel** — نظام الملفات **غير دائم**؛ البيانات والكتابات **تضيع** بين الدوال.

| على Vercel | SQLite ملف | الحل للإنتاج الحقيقي |
|------------|------------|----------------------|
| Next.js | غير مناسب | PostgreSQL (Supabase / Neon) — **خطوة اختيارية** عند طلب العميل |

#### إن استخدمت Vercel للواجهة فقط (مؤقت / demo)

1. [ ] اربط المستودع
2. [ ] Build: `npm run build` (مع `postbuild`)
3. [ ] **لا** تعتمد على `file:./prisma/*.db` على Vercel للبيانات الحقيقية
4. [ ] للإنتاج الكامل: انقل القاعدة إلى **Supabase Postgres** + عدّل `provider` في Prisma (خارج نطاق النشر الحالي ما لم يُطلب صراحة)

---

## 4. بعد النشر — اختبار القبول

افتح الموقع عبر **HTTPS** ونفّذ:

| # | الاختبار | النتيجة المتوقعة |
|---|----------|------------------|
| 1 | `/` | صفحة هبوط + منتجات مميزة من DB |
| 2 | `/shop` | كتالوج وتصنيفات |
| 3 | `/admin/login` | دخول بـ `ADMIN_USER` / `ADMIN_PASSWORD` **الجديدين** |
| 4 | `/admin` | لوحة إحصائيات |
| 5 | `/register` | تسجيل تاجر جديد |
| 6 | `/login` | دخول التاجر |
| 7 | `/admin/import-export` | **تصدير** `products-export.xlsx` |
| 8 | `/checkout` | رسالة واتساب برقم من الإعدادات |
| 9 | تغيير سعر الصرف في `/admin/settings` | ينعكس على `/shop` |

- [ ] لا أخطاء 500 على `/api/products`
- [ ] الكوكيز تعمل (HTTPS + إنتاج)
- [ ] نسخة احتياطية أولى لـ `.db` مأخوذة بعد التأكد

---

## 5. أمان وصيانة

- [ ] تدوير `ADMIN_PASSWORD` و `CUSTOMER_SESSION_SECRET` عند الاشتباه بتسريب
- [ ] مراقبة حجم ملف SQLite ومساحة القرص
- [ ] بعد تحديث الكود: `git pull` → `npm ci` → `db:migrate:deploy` → `build` → إعادة تشغيل العملية
- [ ] **لا** تشغّل `npm run dev` و `npm run build` معاً على Windows (يفسد `.next`)

---

## 6. استكشاف الأخطاء

| المشكلة | ما تفعله |
|---------|----------|
| المنتجات فارغة | تحقق `DATABASE_URL`، `migrate deploy`، صلاحيات الكتابة |
| 401 في الإدارة | `ADMIN_USER` / `ADMIN_PASSWORD` و HTTPS |
| Seed يرفض التشغيل | متوقع في production — لا تستخدم seed على إنتاج حقيقي |
| `Cannot find module './xxxx.js'` | `npm run clean` ثم أعد البناء |
| EPERM عند prisma generate | أوقف `npm run dev` ثم أعد الأمر |

---

## 7. ملخص أوامر npm

```bash
npm run build              # بناء + postbuild (prisma generate)
npm run start:prod         # تشغيل الإنتاج
npm run deploy:prepare     # generate + migrate deploy + build
npm run deploy:checklist   # قائمة تحقق في الطرفية
npm run db:migrate:deploy  # migrations للإنتاج فقط
```

---

**آخر تحقق محلي:** شغّل `npm run build` قبل كل رفع — يجب أن ينجح بدون أخطاء.
