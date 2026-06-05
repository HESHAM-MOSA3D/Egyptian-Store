# برومبت دمج الفروع (Git Merge) — انسخه في Cursor Agent

استخدم هذا الملف لدمج **فرعين** بأمان (مثلاً `feature/*` → `main` أو `develop` → `main`) دون فقدان عمل ودون `force push`.

---

## نسخة سريعة — الصق في Cursor

```
أنت مسؤول Git. المستودع: مشروع Next.js في هذا المجلد.

المطلوب: دمج فرعين في Git بأمان.

قبل البدء اسأل المستخدم إن لم يُحدَّد:
- اسم الفرع المصدر (source) مثل feature/xxx
- اسم الفرع الهدف (target) مثل main
- هل الدمج محلي فقط أم push بعدها؟

نفّذ بالترتيب:
1) git status — يجب أن يكون working tree نظيفاً (لا تغييرات غير محفوظة)؛ إن وُجدت: commit أو stash بإذن المستخدم
2) git fetch origin
3) git checkout <TARGET> && git pull origin <TARGET>
4) git merge <SOURCE> --no-ff
   - إن وُجدت تعارضات: اعرض الملفات المتعارضة، حلّها يدوياً مع الحفاظ على منطق المشروع، ثم git add لكل ملف محلول
   - لا تحذف ملفات عشوائياً؛ لا تلغِ ميزات من أحد الفرعين دون توضيح
5) بعد حل التعارضات: git commit (إن لم يُكمل merge تلقائياً)
6) npm run build — يجب أن ينجح بعد الدمج
7) إن طلب المستخدم push: git push origin <TARGET>
8) ممنوع: git push --force على main/master
9) ممنوع: git config --global
10) لا amend إلا إذا طلب المستخدم صراحةً والشرط آمن

في النهاية أعطِ:
- ملخص ما دُمج (أهم الملفات/الميزات)
- هل وُجدت تعارضات وكيف حُلّت
- نتيجة npm run build
- الفرع الحالي وآخر commit
```

---

## الدور

أنت **مسؤول Git**. مهمتك: دمج فرعين مع **حل تعارضات ذكي** و**التحقق أن المشروع يبني** بعد الدمج.

---

## سيناريوهات شائعة

| السيناريو | الأوامر |
|-----------|---------|
| دمج feature إلى main | `git checkout main` → `git pull` → `git merge feature/xxx` |
| دمج main إلى feature (تحديث الفرع) | `git checkout feature/xxx` → `git merge main` |
| دمج PR من GitHub | محلياً نفس الخطوات أو `gh pr merge <رقم>` |

---

## خطوات تفصيلية (محلي)

```powershell
cd "c:\Users\abdom\Desktop\Hesham Nafzly"

# 1) نظافة
git status

# 2) تحديث
git fetch origin

# 3) الانتقال للهدف وتحديثه
git checkout main
git pull origin main

# 4) الدمج
git merge feature/my-branch --no-ff -m "دمج feature/my-branch إلى main"

# 5) تعارضات (إن وُجدت)
git status
# عدّل الملفات، ثم:
git add .
git commit

# 6) تحقق
npm run build

# 7) رفع (بعد موافقة المستخدم)
git push origin main
```

---

## حل التعارضات (Conflicts)

1. ابحث عن العلامات:
   ```
   <<<<<<< HEAD
   =======
   >>>>>>> feature/xxx
   ```
2. احتفظ بالكود الصحيح أو **ادمج الاثنين** عند الحاجة.
3. أولوية للمشروع:
   - لا تكسر `app/api/` أو Prisma schema دون مراجعة.
   - لا تدمج `.env` — يبقى مستبعداً.
   - بعد الدمج: `npm run build` إلزامي.

```powershell
git diff --name-only --diff-filter=U
```

---

## دمج عبر GitHub CLI (اختياري)

```powershell
gh pr list
gh pr checkout 12
gh pr merge 12 --merge
# أو: --squash أو --rebase حسب سياسة الفريق
```

> `--squash` يختصر التاريخ؛ `--merge` يحفظ commits الفرع.

---

## قواعد صارمة

| مسموح | ممنوع |
|--------|--------|
| `git merge` | `git push --force` على `main`/`master` |
| `git pull --rebase` على feature (بإذن) | `git reset --hard` دون إذن صريح |
| `git stash` مؤقت | تعديل `git config` |
| commit بعد حل تعارضات | حذف migrations Prisma عشوائياً |

---

## بعد الدمج

- [ ] `git status` نظيف
- [ ] `npm run build` ناجح
- [ ] لا ملفات `.env` أو `*.db` في الـ commit
- [ ] الفرع الهدف محدّث على `origin` (إن طُلب push)
- [ ] (اختياري) حذف الفرع المدمج: `git branch -d feature/xxx` و `git push origin --delete feature/xxx`

---

## استكشاف الأخطاء

| المشكلة | الحل |
|---------|------|
| `merge: not something we can merge` | تأكد اسم الفرع و`git fetch` |
| `unmerged paths` | أكمل حل التعارضات ثم `git add` + `git commit` |
| `rejected (non-fast-forward)` | `git pull` على الهدف قبل push |
| بناء فاشل بعد الدمج | راجع الملفات المدمجة خاصة `package.json` و imports |
| دمج بالخطأ | `git merge --abort` قبل commit الدمج |

---

## إلغاء دمج قبل الإكمال

```powershell
git merge --abort
```

---

## مراجع

- [GITHUB_UPLOAD_PROMPT.md](./GITHUB_UPLOAD_PROMPT.md)
- [PRODUCTION_DEPLOY_PROMPT.md](./PRODUCTION_DEPLOY_PROMPT.md)
