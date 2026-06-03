# برومبت رفع المشروع إلى GitHub — انسخه في Cursor Agent

استخدم هذا الملف لرفع المستودع إلى **GitHub** بأمان. لا ترفع أسراراً ولا قاعدة بيانات محلية.

---

## نسخة سريعة — الصق في Cursor

```
أنت مسؤول Git. المشروع: كتالوج جملة Next.js 15 + Prisma + SQLite في هذا المجلد.

المطلوب: رفع الكود إلى GitHub بأمان (بدون أسرار).

اقرأ: .gitignore، .env.example، README.md.

نفّذ بالترتيب:
1) تحقق من .gitignore: يستبعد .env، .env.local، node_modules، .next، prisma/*.db، *.pem
2) git status — تأكد أن .env وملفات .db غير مضافة؛ إن وُجدت في التتبع أزلها من Git دون حذف الملف محلياً
3) تأكد أن .env.example و .env.production.example (إن وُجد) مُتتبَّعان للمستودع
4) npm run build محلياً — إن فشل أصلح قبل الرفع
5) أنشئ commit واحداً أو أكثر برسائل واضحة بالعربية أو الإنجليزية (مثال: "إعداد المشروع للتسليم")
6) إن لم يكن remote:
   - اسأل المستخدم عن رابط المستودع أو أنشئ repo عبر gh repo create (خاص private افتراضياً)
   - git remote add origin <URL>
7) git push -u origin main (أو master حسب الفرع الحالي)
8) لا تستخدم git push --force على main/master
9) لا تعدّل git config (user.name/email)
10) لا تنشئ commit إلا إذا طلب المستخدم صراحةً — هنا المطلوب الرفع فالمستخدم يريد الرفع فأنشئ commit إن كانت هناك تغييرات

في النهاية أعطِ:
- رابط المستودع على GitHub
- ما الذي تم استبعاده عن الرفع
- تذكير: ضبط Secrets على GitHub/الاستضافة لاحقاً (ADMIN_PASSWORD، DATABASE_URL، CUSTOMER_SESSION_SECRET)

لا ترفع: .env، dev.db، node_modules، .next
```

---

## الدور

أنت **مسؤول Git / DevOps**. مهمتك: تجهيز المستودع ورفعه إلى GitHub **بدون تسريب بيانات حساسة**.

---

## ما يُرفع ✅

| الملف/المجلد | السبب |
|--------------|--------|
| `app/`, `components/`, `lib/`, `hooks/`, `store/` | الكود المصدري |
| `prisma/schema.prisma`, `prisma/migrations/` | مخطط القاعدة والهجرات |
| `prisma/seed.ts` | بيانات تجريبية (سكربت فقط) |
| `public/` | ملفات ثابتة |
| `package.json`, `package-lock.json` | الاعتماديات |
| `.env.example`, `.env.production.example` | قوالب بدون أسرار |
| `README.md`, `DEPLOYMENT.md`, `PRODUCTION_*.md` | التوثيق |
| `.gitignore` | حماية الاستبعاد |

---

## ما لا يُرفع ❌

| الملف | السبب |
|-------|--------|
| `.env` | كلمات مرور وأسرار |
| `.env.local` | إعدادات محلية |
| `prisma/dev.db` أو أي `*.db` | بيانات عملاء/منتجات حقيقية |
| `node_modules/` | تُثبَّت عبر `npm ci` |
| `.next/` | مخرجات بناء |
| `out/` | تصدير ثابت إن وُجد |

---

## أوامر يدوية (PowerShell)

```powershell
cd "c:\Users\abdom\Desktop\Hesham Nafzly"

# تحقق قبل الرفع
git status
git check-ignore -v .env prisma/dev.db node_modules .next

# إن لم يكن git مهيأً بعد
git init
git add .
git status
# تأكد أن .env و *.db غير ظاهرين في القائمة الخضراء

git commit -m "إعداد كتالوج الجملة B2B للتسليم"

# على GitHub: New repository → بدون README إن المشروع موجود محلياً
git branch -M main
git remote add origin https://github.com/USER/REPO.git
git push -u origin main
```

### باستخدام GitHub CLI (`gh`)

```powershell
gh auth login
gh repo create beauty-wholesale-catalog --private --source=. --remote=origin --push
```

> غيّر اسم المستودع و`--public` إن أردت مستودعاً عاماً.

---

## إن كان `.env` مُتتبَّعاً بالخطأ

```powershell
git rm --cached .env
git commit -m "إزالة .env من التتبع"
git push
```

ثم غيّر كلمات المرور في الإنتاج إن رُفعت سابقاً.

---

## بعد الرفع على GitHub

1. **Settings → Secrets and variables** (لـ Actions لاحقاً) أو متغيرات الاستضافة:
   - `DATABASE_URL`
   - `ADMIN_USER`
   - `ADMIN_PASSWORD`
   - `CUSTOMER_SESSION_SECRET`
2. أضف **README** يظهر على صفحة المستودع (موجود محلياً).
3. فعّل **Private** إن المشروع لعميل.
4. لا تضع بيانات دخول حقيقية في Issues أو Wiki.

---

## قائمة تحقق سريعة

- [ ] `.env` في `.gitignore` وغير مُرفوع
- [ ] لا ملفات `*.db` في الـ commit
- [ ] `npm run build` ناجح قبل الرفع (اختياري موصى به)
- [ ] `remote` صحيح و`git push` نجح
- [ ] رابط Repo مُسلَّم للمستخدم
- [ ] لم يُستخدم `--force` على `main`

---

## استكشاف الأخطاء

| المشكلة | الحل |
|---------|------|
| `rejected - non-fast-forward` | `git pull --rebase origin main` ثم push |
| `Permission denied` | SSH key أو `gh auth login` |
| ملف كبير | تأكد عدم رفع `node_modules` أو `.next` |
| رفع `.env` بالخطأ | `git rm --cached` + rotate secrets |

---

## مراجع

- [README.md](./README.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [PRODUCTION_DEPLOY_PROMPT.md](./PRODUCTION_DEPLOY_PROMPT.md)
