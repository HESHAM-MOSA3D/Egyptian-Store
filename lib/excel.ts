import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

export type ExcelRow = {
  productId: string;
  productNameAr: string;
  categorySlug: string;
  variantLabel: string;
  priceUsd: number;
  stockQty: number;
  isActive: boolean;
};

export type ImportSummary = {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
};

export async function buildExportWorkbook(): Promise<ExcelJS.Workbook> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const workbook = new ExcelJS.Workbook();

  const catSheet = workbook.addWorksheet("Categories");
  catSheet.columns = [
    { header: "slug", key: "slug", width: 20 },
    { header: "nameAr", key: "nameAr", width: 30 },
    { header: "sortOrder", key: "sortOrder", width: 10 },
    { header: "isActive", key: "isActive", width: 10 },
  ];
  for (const c of categories) {
    catSheet.addRow({
      slug: c.slug,
      nameAr: c.nameAr,
      sortOrder: c.sortOrder,
      isActive: c.isActive,
    });
  }

  const sheet = workbook.addWorksheet("Products");
  sheet.columns = [
    { header: "productId", key: "productId", width: 28 },
    { header: "productNameAr", key: "productNameAr", width: 30 },
    { header: "categorySlug", key: "categorySlug", width: 20 },
    { header: "variantLabel", key: "variantLabel", width: 20 },
    { header: "priceUsd", key: "priceUsd", width: 12 },
    { header: "stockQty", key: "stockQty", width: 10 },
    { header: "isActive", key: "isActive", width: 10 },
  ];

  for (const product of products) {
    if (product.hasVariants && product.variants.length) {
      for (const v of product.variants) {
        sheet.addRow({
          productId: product.id,
          productNameAr: product.nameAr,
          categorySlug: product.category.slug,
          variantLabel: v.labelAr,
          priceUsd: v.priceUsd ?? product.priceUsd,
          stockQty: v.stockQty,
          isActive: v.isActive,
        });
      }
    } else {
      sheet.addRow({
        productId: product.id,
        productNameAr: product.nameAr,
        categorySlug: product.category.slug,
        variantLabel: "",
        priceUsd: product.priceUsd,
        stockQty: product.stockQty,
        isActive: product.isActive,
      });
    }
  }

  return workbook;
}

export async function parseImportBuffer(buffer: ArrayBuffer | Uint8Array): Promise<{
  rows: ExcelRow[];
  errors: string[];
}> {
  const workbook = new ExcelJS.Workbook();
  const data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  await workbook.xlsx.load(data as never);
  const sheet = workbook.worksheets.find((w) => w.name === "Products") ?? workbook.worksheets[0];
  if (!sheet) {
    return { rows: [], errors: ["لا يوجد ورقة بيانات"] };
  }

  const errors: string[] = [];
  const rows: ExcelRow[] = [];
  const headerRow = sheet.getRow(1);
  const headers: Record<string, number> = {};
  headerRow.eachCell((cell, col) => {
    headers[String(cell.value)] = col;
  });

  const required = [
    "productId",
    "productNameAr",
    "categorySlug",
    "variantLabel",
    "priceUsd",
    "stockQty",
    "isActive",
  ];
  for (const key of required) {
    if (!headers[key]) {
      errors.push(`عمود مفقود: ${key}`);
    }
  }
  if (errors.length) return { rows, errors };

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const productId = String(row.getCell(headers.productId).value ?? "").trim();
    if (!productId) return;

    const priceVal = Number(row.getCell(headers.priceUsd).value);
    const stockVal = Number(row.getCell(headers.stockQty).value);
    const activeVal = row.getCell(headers.isActive).value;
    const isActive =
      activeVal === true ||
      activeVal === "true" ||
      activeVal === 1 ||
      activeVal === "1";

    if (Number.isNaN(priceVal)) {
      errors.push(`سطر ${rowNumber}: سعر غير صالح`);
      return;
    }

    rows.push({
      productId,
      productNameAr: String(row.getCell(headers.productNameAr).value ?? ""),
      categorySlug: String(row.getCell(headers.categorySlug).value ?? ""),
      variantLabel: String(row.getCell(headers.variantLabel).value ?? "").trim(),
      priceUsd: priceVal,
      stockQty: Number.isNaN(stockVal) ? 0 : stockVal,
      isActive,
    });
  });

  return { rows, errors };
}

export async function applyImportRows(rows: ExcelRow[]): Promise<ImportSummary> {
  const summary: ImportSummary = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  for (const row of rows) {
    const product = await prisma.product.findUnique({
      where: { id: row.productId },
      include: { variants: true },
    });
    if (!product) {
      summary.skipped++;
      summary.errors.push(`تخطّي: منتج غير موجود ${row.productId}`);
      continue;
    }

    if (row.variantLabel) {
      const variant = product.variants.find(
        (v) => v.labelAr === row.variantLabel || v.sku === row.variantLabel
      );
      if (variant) {
        await prisma.productVariant.update({
          where: { id: variant.id },
          data: {
            priceUsd: row.priceUsd,
            stockQty: row.stockQty,
            isActive: row.isActive,
          },
        });
        summary.updated++;
      } else {
        summary.skipped++;
        summary.errors.push(
          `تخطّي: متغير «${row.variantLabel}» غير موجود للمنتج ${row.productNameAr}`
        );
      }
    } else {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          priceUsd: row.priceUsd,
          stockQty: row.stockQty,
          isActive: row.isActive,
        },
      });
      summary.updated++;
    }
  }

  return summary;
}
