# دليل النشر — Hostinger والاستضافة المشتركة

هذا المستند يوضح **ما إذا كان هذا المشروع (Next.js 15 + Prisma + SQLite) يعمل على استضافة Hostinger المشتركة العادية**، وما الذي تحتاجه للنشر الفعلي دون حذف أي ميزة.

---

## 1. الخلاصة السريعة

| نوع الاستضافة | هل يعمل التطبيق كاملاً؟ |
|---------------|------------------------|
| Hostinger **مشتركة تقليدية** (PHP فقط، بدون Node.js) | **لا** |
| Hostinger **مع دعم تطبيق Node.js** (حسب الخطة) | **نعم** — مع شروط (انظر أدناه) |
| Vercel / Railway / Render | **نعم** — الأنسب لـ Next.js (مع ملاحظات قاعدة البيانات) |
| VPS / سحابة بخادم Node دائم | **نعم** |

**لا يمكن** نشر هذا المشروع كموقع **ثابت فقط** (HTML/CSS/JS بدون خادم) مع الإبقاء على: لوحة الإدارة، تسجيل التجار، API المنتجات، Excel، واتساب، وPrisma. ذلك يتطلب إعادة بناء كاملة وليس موصى به للاستخدام الحقيقي.

---

## 2. هل التطبيق يحتاج Node.js؟ — نعم

### 2.1 ماذا يعمل على الخادم (وليس في المتصفح فقط)

1. **خادم Next.js** بعد `npm run build` ثم `npm start` (أو منصة تدير العملية).
2. **مسارات API** (`app/api/`) — أمثلة:
   - عامة: `/api/products`, `/api/categories`, `/api/settings`
   - تاجر: `/api/customer/login`, `register`, `logout`, `me`
   - إدارة: `/api/admin/*` (منتجات، تصنيفات، إعدادات، إحصائيات، استيراد/تصدير Excel، تسعير جماعي)
3. **Prisma + SQLite** — قراءة/كتابة ملف قاعدة البيانات من الخادم.
4. **Middleware** — حماية `/admin` و`/api/admin` و`/account`.
5. **صفحة رئيسية** — تُجلب بياناتها من قاعدة البيانات على الخادم (`getLandingPageData`).
6. **مكتبات خادم**: `bcryptjs` (كلمات مرور التجار)، `exceljs` (استيراد/تصدير).

### 2.2 ماذا يعمل في المتصفح (عميل)

- واجهة المتجر، السلة (Zustand + `localStorage`)، فتح واتساب، جزء من بيانات الضيف.

**الاستنتاج:** بدون **عملية Node.js تعمل باستمرار** (أو منصة serverless تدعم Next.js + API)، التطبيق **لا يعمل**.

---

## 3. Hostinger Shared — ماذا يعني ذلك عملياً؟

### 3.1 الاستضافة المشتركة الأساسية (مواقع PHP / ملفات ثابتة)

- رفع مجلد `out` أو `public_html` فقط **لا يكفي**.
- لا تُنفَّذ مسارات `/api/*`.
- لا يعمل Prisma ولا SQLite على الخادم بهذه الطريقة.
- **النتيجة:** المتجر لن يحمّل المنتجات، والإدارة لن تعمل.

### 3.2 خطط Hostinger التي تدعم Node.js

تختلف حسب الخطة واللوحة (مثلاً **Node.js Web App** أو **Deploy from Git**). إن وُجد:

**المتطلبات:**

| المتطلب | القيمة المقترحة |
|---------|-----------------|
| Node.js | **20.x** أو أحدث (متوافق مع `package.json` والمشروع) |
| npm | لتثبيت الاعتماديات والبناء |
| ذاكرة | كافية لـ `next build` (يفضّل 1 GB+ أثناء البناء) |
| قرص قابل للكتابة | لملف SQLite ومجلد `prisma/migrations` |
| HTTPS | مفعّل (للكوكيز `secure` في الإنتاج) |

**خطوات نموذجية على Hostinger (Node):**

```bash
# على الخادم أو عبر SSH إن وُجد
cd /path/to/your-app
npm ci
npx prisma generate
npx prisma migrate deploy
npx prisma db seed    # اختياري — بيانات تجريبية
npm run build
npm start
```

اضبط في لوحة Hostinger **متغيرات البيئة** (انظر القسم 5).  
عيّن **أمر التشغيل** إلى `npm start` والمنفذ الذي توفره المنصة (غالباً `PORT` من البيئة).

**تحذيرات SQLite على الاستضافة المشتركة:**

- مسار `DATABASE_URL` يجب أن يشير إلى مجلد **دائم وقابل للكتابة** (مثلاً خارج مجلد يُمسح عند كل نشر).
- خذ **نسخاً احتياطياً** لملف `.db` بانتظام.
- إن أُعيد نشر التطبيق على مجلد جديد دون نقل الملف، **تُفقد البيانات**.
- للإنتاج الجاد على مشاركة محدودة: يُفضّل لاحقاً PostgreSQL (مثلاً Supabase/Neon) مع تعديل `schema.prisma` — خارج نطاق هذا المستند لكنه خيار عملي.

### 3.3 إن لم تتوفر Node.js على خطتك

الخيارات العملية **دون حذف الميزات**:

1. **ترقية Hostinger** إلى خطة تدعم Node.js (إن متوفرة).
2. **نشر التطبيق كاملاً** على:
   - [Vercel](https://vercel.com) — ممتاز لـ Next.js (مع قاعدة بيانات خارجية بدل SQLite على القرص).
   - [Railway](https://railway.app) أو [Render](https://render.com) — Node + قرص دائم أو Postgres.
3. **فصل الطبقات** (أكثر تعقيداً):
   - واجهة Next على Vercel.
   - API + قاعدة بيانات على Railway/Render/Supabase.
   - يتطلب ضبط CORS والنطاقات — نفس الكود تقريباً لكن استضافة مزدوجة.
4. **نقل المشروع لاحقاً إلى PHP + MySQL على Hostinger** — مذكور في README كمسار هجرة منفصل (إعادة تنفيذ API)، وليس نشر هذا المستودع كما هو.

**غير موصى به للإنتاج:** تحويل الإدارة إلى `localStorage` فقط — يفقد الأمان، التزامن، Excel، وحسابات التجار الحقيقية.

---

## 4. Vercel / Railway / Render — ملاحظات سريعة

| المنصة | Next.js 15 | SQLite ملف محلي |
|--------|------------|-----------------|
| Vercel | ممتاز | **غير مناسب** (نظام ملفات غير دائم؛ البيانات تضيع) |
| Railway / Render | جيد | ممكن مع **Volume** دائم، أو الأفضل Postgres |
| VPS | كامل التحكم | مناسب مع مسار ثابت لـ `.db` |

للنشر على Vercel مع الإبقاء على كل الميزات: استخدم **PostgreSQL** (Supabase مجاني للبداية) وغيّر `provider` في Prisma — خطوة منفصلة عن الكود الحالي.

---

## 5. متغيرات البيئة

أنشئ ملف `.env` على الخادم (أو في لوحة Hostinger → Environment variables). لا ترفع `.env` إلى Git.

| المتغير | مطلوب | الوصف |
|---------|--------|--------|
| `DATABASE_URL` | نعم | SQLite: `file:./prisma/production.db` — استخدم مساراً مطلقاً على الخادم إن أمكن |
| `ADMIN_USER` | نعم (إنتاج) | اسم دخول الإدارة — غيّر الافتراضي |
| `ADMIN_PASSWORD` | نعم (إنتاج) | كلمة مرور قوية للإدارة |
| `CUSTOMER_SESSION_SECRET` | يُنصح به | سر توقيع جلسة التاجر (سلسلة عشوائية طويلة) |
| `NODE_ENV` | تلقائي | `production` عند `npm start` |
| `PORT` | حسب المنصة | منفذ الاستماع (Hostinger/Render غالباً يحددونه) |

مثال `.env` للإنتاج:

```env
DATABASE_URL="file:/home/u123456/domains/example.com/prisma/production.db"
ADMIN_USER="your_admin"
ADMIN_PASSWORD="strong-random-password-here"
CUSTOMER_SESSION_SECRET="another-long-random-secret"
```

---

## 6. Prisma — migrate و seed

```bash
# توليد العميل (يُشغَّل أيضاً عبر postinstall)
npx prisma generate

# تطبيق migrations على قاعدة الإنتاج (لا تستخدم migrate dev على السيرفر)
npx prisma migrate deploy

# بيانات تجريبية (اختياري — متجر + admin + تاجر demo)
npx prisma db seed
```

- **`migrate dev`**: للتطوير المحلي فقط.
- **`db seed`**: يملأ تصنيفات ومنتجات تجريبية؛ تجنّبه على إنتاج حقيقي إن لم ترد بيانات demo.

---

## 7. البناء والتشغيل

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
npm start
```

- **`npm run build`**: يبني Next.js (صفحات + API + middleware).
- **`npm start`**: يشغّل `next start` — يحتاج Node يعمل **باستمرار** (ليس مجرد رفع ملفات HTML).

للتطوير محلياً: `npm run dev`.

---

## 8. قائمة تحقق قبل الإطلاق

- [ ] Node 20+ متوفر على الاستضافة
- [ ] `ADMIN_PASSWORD` و `ADMIN_USER` غير الافتراضيين
- [ ] `CUSTOMER_SESSION_SECRET` مضبوط
- [ ] `DATABASE_URL` يشير لمسار دائم وقابل للكتابة
- [ ] HTTPS مفعّل
- [ ] نسخ احتياطي لملف SQLite مجدول
- [ ] `npm run build` ينجح على الخادم أو في CI قبل النشر
- [ ] اختبار: `/shop`, `/admin`, تسجيل تاجر، تصدير Excel

---

## 9. الأسئلة الشائعة

**هل يكفي رفع مجلد `.next` و `public` فقط؟**  
لا. تحتاج `node_modules` (أو `npm ci` على السيرفر) وعملية `next start`.

**هل يعمل على cPanel بدون Node؟**  
لا، للتطبيق الحالي.

**هل Hostinger VPS يختلف عن Shared؟**  
نعم — VPS يعطيك تحكمًا كاملاً في Node وsystemd ومسار SQLite؛ Shared محدود بما تتيحه الخطة.

**هل يمكن static export؟**  
لا مع الميزات الحالية (API + Prisma + auth + Excel).

---

## 10. مراجع داخل المشروع

- `PRODUCTION_CHECKLIST.md` — قائمة تحقق عربية (ما قبل/بعد النشر + 3 مسارات + اختبار قبول)
- `README.md` — تشغيل محلي وملخص النشر
- `.env.example` — قالب التطوير
- `.env.production.example` — قالب الإنتاج الكامل
- `package.json` — أوامر `build`, `postbuild`, `start:prod`, `deploy:prepare`, `deploy:checklist`, `db:migrate:deploy`
