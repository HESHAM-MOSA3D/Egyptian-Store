import { NextRequest, NextResponse } from "next/server";
import { applyImportRows, parseImportBuffer } from "@/lib/excel";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  const action = formData.get("action") ?? "preview";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "لم يتم رفع ملف" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const { rows, errors } = await parseImportBuffer(buffer);

  if (errors.length) {
    return NextResponse.json(
      { errors, created: 0, updated: 0, skipped: 0 },
      { status: 400 }
    );
  }

  if (action === "preview") {
    return NextResponse.json({
      preview: true,
      rowCount: rows.length,
      sample: rows.slice(0, 8),
      errors: [],
      created: 0,
      updated: 0,
      skipped: 0,
    });
  }

  if (action === "apply") {
    const summary = await applyImportRows(rows);
    return NextResponse.json({
      ...summary,
      rowCount: rows.length,
    });
  }

  return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
}
