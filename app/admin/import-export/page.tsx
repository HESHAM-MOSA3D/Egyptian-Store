"use client";

import { useState } from "react";
import { FileSpreadsheet, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

type ImportSummary = {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
  rowCount?: number;
};

export default function AdminImportExportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{
    rowCount: number;
    sample: unknown[];
  } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [message, setMessage] = useState("");

  const upload = async (action: "preview" | "apply") => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("action", action);
    const res = await fetch("/api/admin/import", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      setErrors(data.errors ?? [data.error ?? "فشل التحقق"]);
      setPreview(null);
      setSummary(null);
      return;
    }
    setErrors([]);
    if (action === "preview") {
      setPreview({ rowCount: data.rowCount, sample: data.sample });
      setSummary(null);
      setMessage(`تم التحقق: ${data.rowCount} سطر جاهز للاستيراد`);
    } else {
      setSummary({
        created: data.created ?? 0,
        updated: data.updated ?? 0,
        skipped: data.skipped ?? 0,
        errors: data.errors ?? [],
        rowCount: data.rowCount,
      });
      setPreview(null);
      setMessage("اكتمل الاستيراد");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="استيراد وتصدير Excel"
        description="تصدير المنتجات والتصنيفات والمتغيرات — استيراد مع التحقق وملخص النتائج"
      />

      <Card className="mb-6 max-w-xl border-teal-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Download className="h-5 w-5 text-primary" />
            تصدير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-teal-700">
            ملف Excel يتضمن أوراق التصنيفات والمنتجات مع المتغيرات.
          </p>
          <Button asChild className="gap-2">
            <a href="/api/admin/export" download>
              <FileSpreadsheet className="h-4 w-4" />
              تحميل products-export.xlsx
            </a>
          </Button>
        </CardContent>
      </Card>

      <Card className="max-w-xl border-teal-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="h-5 w-5 text-primary" />
            استيراد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            className="block w-full text-sm"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setPreview(null);
              setSummary(null);
              setErrors([]);
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => upload("preview")} disabled={!file}>
              التحقق ومعاينة
            </Button>
            <Button onClick={() => upload("apply")} disabled={!preview}>
              تأكيد الاستيراد
            </Button>
          </div>

          {errors.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <p className="mb-2 text-sm font-semibold text-red-800">أخطاء التحقق</p>
              <ul className="max-h-40 overflow-y-auto text-sm text-red-700">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {preview && (
            <div className="rounded-xl border border-teal-100 bg-teal-50/30 p-3">
              <p className="text-sm font-medium text-primary-dark">
                {preview.rowCount} سطر — عينة من البيانات:
              </p>
              <pre className="mt-2 max-h-48 overflow-auto rounded bg-white p-2 text-xs">
                {JSON.stringify(preview.sample, null, 2)}
              </pre>
            </div>
          )}

          {summary && (
            <div className="grid gap-2 sm:grid-cols-4">
              <div className="rounded-xl border border-teal-100 bg-white p-3 text-center">
                <p className="text-2xl font-bold text-primary">{summary.created}</p>
                <p className="text-xs text-teal-600">جديد</p>
              </div>
              <div className="rounded-xl border border-teal-100 bg-white p-3 text-center">
                <p className="text-2xl font-bold text-teal-700">{summary.updated}</p>
                <p className="text-xs text-teal-600">محدّث</p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
                <p className="text-2xl font-bold text-amber-800">{summary.skipped}</p>
                <p className="text-xs text-amber-700">متخطى</p>
              </div>
              <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-center">
                <p className="text-2xl font-bold text-red-700">
                  {summary.errors.length}
                </p>
                <p className="text-xs text-red-600">أخطاء</p>
              </div>
            </div>
          )}

          {summary && summary.errors.length > 0 && (
            <ul className="max-h-32 overflow-y-auto text-xs text-red-600">
              {summary.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}

          {message && <p className="text-sm text-primary">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
