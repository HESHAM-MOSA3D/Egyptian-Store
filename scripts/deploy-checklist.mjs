#!/usr/bin/env node
/**
 * يطبع قائمة تحقق النشر — شغّل: npm run deploy:checklist
 */
const lines = [
  "",
  "=== قائمة تحقق النشر — كتالوج الجملة ===",
  "",
  "قبل الرفع:",
  "  [ ] Node.js 20+ على الخادم",
  "  [ ] npm run build ينجح محلياً أو في CI",
  "  [ ] ADMIN_USER و ADMIN_PASSWORD غير الافتراضي (ليس admin/demo123)",
  "  [ ] CUSTOMER_SESSION_SECRET سر عشوائي طويل",
  "  [ ] DATABASE_URL مسار مطلق دائم وقابل للكتابة",
  "  [ ] لا ترفع .env أو ملفات *.db إلى Git",
  "",
  "على الخادم:",
  "  [ ] npm ci",
  "  [ ] npx prisma generate",
  "  [ ] npx prisma migrate deploy",
  "  [ ] لا تشغّل db seed على إنتاج حقيقي (معطّد في production)",
  "  [ ] npm run build",
  "  [ ] npm run start:prod (أو npm start)",
  "  [ ] HTTPS مفعّل",
  "  [ ] PORT من لوحة الاستضافة",
  "  [ ] نسخ احتياطي مجدول لملف SQLite",
  "",
  "بعد النشر (اختبار قبول):",
  "  [ ] / — الصفحة الرئيسية",
  "  [ ] /shop — منتجات من قاعدة البيانات",
  "  [ ] /admin/login — دخول إدارة",
  "  [ ] /register — تسجيل تاجر جديد",
  "  [ ] /admin/import-export — تصدير Excel",
  "  [ ] /checkout — رابط واتساب",
  "",
  "تذكير: الاستضافة الثابتة (PHP فقط) لا تكفي — التطبيق يحتاج Node.js.",
  "التوثيق: PRODUCTION_CHECKLIST.md | DEPLOYMENT.md",
  "",
];

console.log(lines.join("\n"));
