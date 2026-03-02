import { NextResponse } from "next/server";
import { getTodaysPrompt } from "@/lib/prompts/rotation";
import { requireSession } from "@/lib/auth/session";

export async function GET() {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prompt = await getTodaysPrompt();
  if (!prompt) {
    return NextResponse.json({ error: "No prompts available" }, { status: 404 });
  }
  return NextResponse.json(prompt);
}
