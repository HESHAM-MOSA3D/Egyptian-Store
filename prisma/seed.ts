import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

if (
  process.env.NODE_ENV === "production" &&
  process.env.ALLOW_SEED !== "true"
) {
  console.error(
    "Seed معطّد في الإنتاج. للبيانات التجريبية على سيرفر تجريبي فقط: ALLOW_SEED=true npx prisma db seed"
  );
  process.exit(1);
}

const prisma = new PrismaClient();

function images(seed: string) {
  return JSON.stringify([seed]);
}

async function main() {
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.settings.deleteMany();

  await prisma.settings.create({
    data: {
      id: "singleton",
      storeNameAr: "مركز التجميل للجملة",
      usdToSypRate: 15000,
      roundingMode: "NEAREST_1000",
      whatsappNumber: "201015873407",
      deliveryNoteAr: "التوصيل متاح داخل المدينة خلال 24-48 ساعة",
    },
  });

  const categories = await Promise.all([
    prisma.category.create({
      data: { nameAr: "عناية بالبشرة", slug: "skin-care", sortOrder: 1 },
    }),
    prisma.category.create({
      data: { nameAr: "الشعر", slug: "hair", sortOrder: 2 },
    }),
    prisma.category.create({
      data: { nameAr: "العطور", slug: "perfumes", sortOrder: 3 },
    }),
    prisma.category.create({
      data: { nameAr: "الكريمات", slug: "creams", sortOrder: 4 },
    }),
    prisma.category.create({
      data: { nameAr: "الصابون الطبيعي", slug: "natural-soap", sortOrder: 5 },
    }),
    prisma.category.create({
      data: { nameAr: "مكياج", slug: "makeup", sortOrder: 6 },
    }),
    prisma.category.create({
      data: { nameAr: "أدوات", slug: "tools", sortOrder: 7 },
    }),
  ]);

  const [skin, hair, perfumes, creams, soap, makeup, tools] = categories;

  const simpleProducts = [
    { cat: skin, name: "سيروم فيتامين C", seed: "serum-vitamin-c", price: 12, stock: 40, desc: "سيروم مشرق للبشرة" },
    { cat: skin, name: "تونر ماء الورد", seed: "toner-rose", price: 8, stock: 55, desc: "تونر مرطب ومنعش" },
    { cat: skin, name: "واقي شمس SPF50", seed: "sunscreen-spf50", price: 14, stock: 30, desc: "حماية يومية خفيفة" },
    { cat: skin, name: "مقشر لطيف", seed: "gentle-scrub", price: 7, stock: 25, desc: "تقشير أسبوعي لطيف" },
    { cat: creams, name: "لوشن الجسم الفانيلا", seed: "body-lotion-vanilla", price: 9, stock: 60, desc: "ترطيب طويل للجسم" },
    { cat: creams, name: "كريم اليدين بالشيا", seed: "hand-cream-shea", price: 5, stock: 80, desc: "ترطيب سريع لليدين" },
    { cat: tools, name: "فرشاة تنظيف الوجه", seed: "face-brush", price: 4, stock: 35, desc: "فرشاة سيليكون" },
    { cat: tools, name: "مجموعة إسفنجات مكياج", seed: "makeup-sponges", price: 3, stock: 90, desc: "5 قطع متنوعة" },
    { cat: perfumes, name: "عطر زهور الربيع", seed: "perfume-spring", price: 18, stock: 20, desc: "عطر نسائي خفيف" },
    { cat: perfumes, name: "عطر العود الكلاسيكي", seed: "perfume-oud", price: 22, stock: 15, desc: "عطر شرقي فاخر" },
  ];

  for (const p of simpleProducts) {
    await prisma.product.create({
      data: {
        categoryId: p.cat.id,
        nameAr: p.name,
        descriptionAr: p.desc,
        images: images(p.seed),
        priceUsd: p.price,
        stockQty: p.stock,
        hasVariants: false,
      },
    });
  }

  await prisma.product.create({
    data: {
      categoryId: hair.id,
      nameAr: "شامبو احترافي",
      descriptionAr: "شامبو بتركيبات متعددة",
      images: images("pro-shampoo"),
      priceUsd: 11,
      hasVariants: true,
      stockQty: 0,
      variants: {
        create: [
          { labelAr: "250 مل", priceUsd: 11, stockQty: 40, sortOrder: 0 },
          { labelAr: "500 مل", priceUsd: 18, stockQty: 25, sortOrder: 1 },
          { labelAr: "1 لتر", priceUsd: 28, stockQty: 10, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      categoryId: perfumes.id,
      nameAr: "عطر فاخر بأحجام",
      descriptionAr: "اختر الحجم المناسب",
      images: images("luxury-perfume-sizes"),
      priceUsd: 15,
      hasVariants: true,
      variants: {
        create: [
          { labelAr: "30 مل", priceUsd: 15, stockQty: 12, sortOrder: 0 },
          { labelAr: "50 مل", priceUsd: 24, stockQty: 8, sortOrder: 1 },
          { labelAr: "100 مل", priceUsd: 38, stockQty: 5, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      categoryId: soap.id,
      nameAr: "صابون طبيعي",
      descriptionAr: "صابون يدوي بمكونات طبيعية",
      images: images("natural-soap"),
      priceUsd: 3.5,
      hasVariants: true,
      variants: {
        create: [
          { labelAr: "فحم", priceUsd: 3.5, stockQty: 50, sortOrder: 0 },
          { labelAr: "نعناع", priceUsd: 3.5, stockQty: 35, sortOrder: 1 },
          { labelAr: "صبار", priceUsd: 3.5, stockQty: 0, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      categoryId: makeup.id,
      nameAr: "أحمر شفاه مات",
      descriptionAr: "ألوان متعددة للجملة",
      images: images("matte-lipstick"),
      priceUsd: 6,
      hasVariants: true,
      variants: {
        create: [
          { labelAr: "وردي", priceUsd: 6, stockQty: 30, sortOrder: 0 },
          { labelAr: "أحمر", priceUsd: 6, stockQty: 28, sortOrder: 1 },
          { labelAr: "نود", priceUsd: 6.5, stockQty: 22, sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      categoryId: skin.id,
      nameAr: "قناع طين (يُخفى عند النفاد)",
      descriptionAr: "منتج تجريبي HIDE",
      images: images("clay-mask-hide"),
      priceUsd: 10,
      stockQty: 0,
      outOfStockBehavior: "HIDE",
    },
  });

  await prisma.product.create({
    data: {
      categoryId: skin.id,
      nameAr: "زيت عناية (معطل عند النفاد)",
      descriptionAr: "منتج تجريبي DISABLE",
      images: images("care-oil-disable"),
      priceUsd: 11,
      stockQty: 0,
      outOfStockBehavior: "DISABLE",
    },
  });

  await prisma.product.create({
    data: {
      categoryId: hair.id,
      nameAr: "بلسم إصلاح (رمادي عند النفاد)",
      descriptionAr: "منتج تجريبي GRAYED",
      images: images("repair-balm-grayed"),
      priceUsd: 9,
      stockQty: 0,
      outOfStockBehavior: "GRAYED",
    },
  });

  await prisma.product.create({
    data: {
      categoryId: makeup.id,
      nameAr: "منتج مخفي للإدارة فقط",
      descriptionAr: "isHidden=true",
      images: images("hidden-admin-product"),
      priceUsd: 20,
      stockQty: 100,
      isHidden: true,
    },
  });

  await prisma.product.create({
    data: {
      categoryId: tools.id,
      nameAr: "ميرور مكياج LED",
      descriptionAr: "مرآة احترافية",
      images: images("led-makeup-mirror"),
      priceUsd: 15,
      stockQty: 18,
    },
  });

  await prisma.product.create({
    data: {
      categoryId: skin.id,
      nameAr: "جل تنظيف الوجه",
      descriptionAr: "مناسب للبشرة الدهنية",
      images: images("face-cleansing-gel"),
      priceUsd: 7.5,
      stockQty: 42,
    },
  });

  const demoPasswordHash = await bcrypt.hash("demo123", 10);
  await prisma.customer.create({
    data: {
      name: "تاجر تجريبي",
      phone: "201015873407",
      address: "فرشوط — العركي — بجوار موقف العركي",
      passwordHash: demoPasswordHash,
    },
  });

  console.log(
    "Seed completed:",
    await prisma.product.count(),
    "products,",
    await prisma.customer.count(),
    "customers"
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });