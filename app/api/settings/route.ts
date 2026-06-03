import { NextResponse } from "next/server";
import { getSettings, toPublicSettings } from "@/lib/settings";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(toPublicSettings(settings));
}
