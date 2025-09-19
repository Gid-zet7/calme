import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    message: "Webhook test endpoint is working",
    timestamp: new Date().toISOString(),
    env: {
      KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL ? "✅ Set" : "❌ Missing",
      DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
    }
  });
}
