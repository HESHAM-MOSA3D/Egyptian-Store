import { NextResponse } from "next/server";
import { buildExportWorkbook } from "@/lib/excel";

export async function GET() {
  const workbook = await buildExportWorkbook();
  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="products-export.xlsx"',
    },
  });
}
