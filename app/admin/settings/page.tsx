"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { AlertMessage } from "@/components/ui/alert-message";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    storeNameAr: "",
    storeDescriptionAr: "",
    usdToSypRate: 50,
    roundingMode: "NEAREST_1000",
    whatsappNumber: "",
    deliveryNoteAr: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((s) =>
        setForm({
          storeNameAr: s.storeNameAr,
          storeDescriptionAr: s.storeDescriptionAr ?? "",
          usdToSypRate: s.usdToSypRate,
          roundingMode: s.roundingMode,
          whatsappNumber: s.whatsappNumber,
          deliveryNoteAr: s.deliveryNoteAr ?? "",
        })
      );
  }, []);

  const save = async () => {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <AdminPageHeader
        title="الإعدادات"
        description="سعر الصرف، التقريب، واتساب، ومعلومات المتجر"
      />
      <Card className="max-w-lg border-teal-100">
        <CardHeader>
          <CardTitle>إعدادات المتجر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>اسم المتجر</Label>
            <Input
              value={form.storeNameAr}
              onChange={(e) =>
                setForm({ ...form, storeNameAr: e.target.value })
              }
            />
          </div>
          <div>
            <Label>وصف المتجر</Label>
            <Textarea
              rows={3}
              value={form.storeDescriptionAr}
              onChange={(e) =>
                setForm({ ...form, storeDescriptionAr: e.target.value })
              }
              placeholder="يظهر في الصفحة الرئيسية إن وُجد"
            />
          </div>
          <div>
            <Label>سعر صرف USD → EGP</Label>
            <Input
              type="number"
              value={form.usdToSypRate}
              onChange={(e) =>
                setForm({ ...form, usdToSypRate: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label>تقريب الأسعار للعميل</Label>
            <Select
              value={form.roundingMode}
              onChange={(e) =>
                setForm({ ...form, roundingMode: e.target.value })
              }
            >
              <option value="NEAREST_1000">أقرب 1000 ج.م</option>
              <option value="NEAREST_500">أقرب 500 ج.م</option>
            </Select>
          </div>
          <div>
            <Label>رقم واتساب لاستلام الطلبات (أرقام فقط)</Label>
            <Input
              value={form.whatsappNumber}
              onChange={(e) =>
                setForm({ ...form, whatsappNumber: e.target.value })
              }
            />
          </div>
          <div>
            <Label>ملاحظة التوصيل (اختياري)</Label>
            <Textarea
              value={form.deliveryNoteAr}
              onChange={(e) =>
                setForm({ ...form, deliveryNoteAr: e.target.value })
              }
            />
          </div>
          <Button onClick={save}>حفظ الإعدادات</Button>
          {saved && (
            <AlertMessage variant="success">تم حفظ الإعدادات بنجاح</AlertMessage>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
