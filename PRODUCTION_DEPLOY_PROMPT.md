# برومبت النشر للإنتاج (Production) — انسخه في Cursor Agent

استخدم هذا الملف لتجهيز المشروع **للإنتاج** دون حذف ميزات. المرجع التفصيلي: **`DEPLOYMENT.md`** و **`README.md`**.

---

## نسخة سريعة — الصق في Cursor

```
أنت مهندس DevOps + Next.js. المشروع جاهز محلياً (Next.js 15 + Prisma + SQLite).

المطلوب: تجهيز نشر إنتاج كامل لهذا المستودع دون حذف أي ميزة (إدارة، API، Excel، واتساب، حسابات تجار).

اقرأ: DEPLOYMENT.md، README.md، package.json، prisma/schema.prisma.

نفّذ بالترتيب:
1) تحقق أن npm run build ينجح محلياً؛ إن فشل أصلح الأخطاء.
2) وثّق/حدّث .env.production.example بكل المتغيرات المطلوبة.
3) أضف سكربتات npm إن لزم: postbuild، start:prod، deploy checklist.
4) جهّز ملف PRODUCTION_CHECKLIST.md (عربي) بخطوات ما قبل/بعد النشر.
5) لا تدّعي أن الاستضافة الثابتة (PHP فقط) تكفي — التطبيق يحتاج Node.js.
6) قدّم 3 مسارات نشر واضحة مع خطوات:
   أ) Hostinger مع Node.js (SQLite بمسار دائم)
   ب) Railway أو Render (Node + قرص دائم أو Postgres لاحقاً)
   ج) Vercel + تحذير SQLite (اقترح Postgres/Supabase كخطوة اختيارية فقط إن طلب المستخدم)
7) إنتاج: غيّر ADMIN_PASSWORD و CUSTOMER_SESSION_SECRET، تعطيل seed على السيرفر الحقيقي.
8) نسخ احتياطي لملف .db، HTTPS، PORT من لوحة الاستضافة.
9) اختبار قبول بعد النشر: /، /shop، /admin، تسجيل تاجر، تصدير Excel.

لا تسأل أسئلة إلا إنك محجوب. أنهِ بـ npm run build ناجح.
```

---

## الدور

أنت **مهندس نشر (Senior DevOps + Next.js)**. المشروع موجود ويعمل في التطوير. مهمتك: **إخراجه إلى production** بأمان ووضوح للعميل/المستقل.

---

## سياق المشروع (لا تغيّره)

| البند | القيمة |
|--------|--------|
| الإطار | Next.js 15 App Router + TypeScript |
| قاعدة البيانات | Prisma + **SQLite** (ملف على القرص) |
| التشغيل | `npm run build` ثم `npm start` (عملية Node **دائمة**) |
| المصادقة | إدارة: `ADMIN_USER` / `ADMIN_PASSWORD` + cookie |
| التاجر | bcrypt + `CUSTOMER_SESSION_SECRET` + cookie |
| ممنوع | static export فقط، أو إزالة API/Excel/Prisma |

**لا يعمل** على Hostinger مشتركة **PHP/ثابت فقط** بدون Node.

---

## الهدف

1. بناء إنتاج ناجح (`npm run build`).
2. تشغيل مستقر (`npm start` أو منصة تدير العملية).
3. قاعدة بيانات مهيأة (`prisma migrate deploy`).
4. متغيرات بيئة آمنة للإنتاج.
5. توثيق عربي واضح للعميل.

---

## متغيرات البيئة (إلزامي في الإنتاج)

```env
DATABASE_URL="file:/مسار/مطلق/دائم/production.db"
ADMIN_USER="غير-admin"
ADMIN_PASSWORD="كلمة-قوية-عشوائية"
CUSTOMER_SESSION_SECRET="سر-طويل-عشوائي"
NODE_ENV=production
PORT=3000
```

> في README يُشار أحياناً إلى `SESSION_SECRET` — الاسم في الكود: **`CUSTOMER_SESSION_SECRET`**.

---

## أوامر النشر القياسية

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
# npx prisma db seed   ← فقط بيئة تجريبية، ليس إنتاج حقيقي
npm run build
npm start
```

محلياً قبل الرفع:

```bash
npm run clean
npm run build
```

---

## مسارات النشر (اختر واحداً ووثّقه)

### أ) Hostinger — Node.js Web App

- Node **20+**
- `DATABASE_URL` بمسار **مطلق** خارج مجلد يُمسح عند كل deploy
- HTTPS مفعّل
- أمر التشغيل: `npm start`
- نسخ احتياطي أسبوعي لملف `.db`

### ب) Railway / Render

- مناسب لـ Next.js + Node دائم
- Volume لملف SQLite **أو** ترحيل لاحق إلى PostgreSQL (مشروع منفصل)

### ج) Vercel

- ممتاز لـ Next.js
- **تحذير:** SQLite على نظام ملفات غير دائم — لا تستخدمه للإنتاج الحقيقي على Vercel دون Postgres

---

## قائمة تحقق القبول (Production)

- [ ] `npm run build` ينجح بدون أخطاء
- [ ] `npm start` يفتح الموقع و`/shop` يعرض منتجات
- [ ] `/admin/login` يعمل بكلمات مرور **غير** demo
- [ ] تغيير سعر الصرف في الإعدادات ينعكس على المتجر
- [ ] طلب واتساب من `/checkout` يفتح برقم من الإعدادات
- [ ] تصدير/استيراد Excel من `/admin/import-export`
- [ ] لا أخطاء hydration في الكونسول (سلة localStorage)
- [ ] HTTPS + cookies تعمل
- [ ] نسخة احتياطية لقاعدة البيانات موثّقة

---

## قيود صارمة

- **لا** تحذف ميزات لتناسب استضافة ثابتة.
- **لا** تدّعي أن رفع `public_html` فقط يكفي.
- **لا** ترفع `.env` أو `dev.db` إلى Git.
- **لا** تترك `admin` / `demo123` في الإنتاج.
- **لا** تشغّل `npm run build` و `npm run dev` معاً على Windows (يفسد `.next`).

---

## مخرجات متوقعة من الـ Agent

1. ملف **`PRODUCTION_CHECKLIST.md`** (عربي) — خطوة بخطوة.
2. تحديث **`.env.example`** أو **`.env.production.example`** إن لزم.
3. أي سكربتات npm مفيدة (`clean`, `dev:clean` موجودة مسبقاً).
4. قسم مختصر في README يشير لهذا الملف.
5. **`npm run build` ناجح** في نهاية المهمة.

---

## استكشاف الأخطاء

| المشكلة | الحل |
|---------|------|
| `Cannot find module './5611.js'` | أوقف dev، `npm run clean`، أعد `npm run dev` أو build |
| EPERM prisma generate | أوقف `npm run dev` ثم `npx prisma generate` |
| المنتجات لا تظهر | تحقق `DATABASE_URL` و `migrate deploy` |
| 401 في الإدارة | `ADMIN_USER` / `ADMIN_PASSWORD` و cookie HTTPS |

---

## مراجع

- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [README.md](./README.md)
