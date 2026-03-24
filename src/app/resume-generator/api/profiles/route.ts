import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { authenticateRequest } from "@/lib/auth";

const PROFILES_DIR = path.join(process.cwd(), "profiles");

export async function GET() {
  if (!fs.existsSync(PROFILES_DIR)) {
    return NextResponse.json([]);
  }
  const names = fs
    .readdirSync(PROFILES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({
      name: f.replace(".json", ""),
      mtime: fs.statSync(path.join(PROFILES_DIR, f)).mtimeMs,
    }))
    .sort((a, b) => a.mtime - b.mtime)
    .map((f) => f.name);
  return NextResponse.json(names);
}

function sanitizeName(name: string): string | null {
  const clean = name.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
  if (!clean || clean !== name.trim()) return null;
  return clean;
}

export async function POST(request: Request) {
  const authError = authenticateRequest(request);
  if (authError) return authError;
  const { name, data } = await request.json();
  if (!name || !data) {
    return NextResponse.json(
      { error: "Missing name or data" },
      { status: 400 },
    );
  }
  const safeName = sanitizeName(name);
  if (!safeName) {
    return NextResponse.json(
      {
        error:
          "Invalid profile name. Use only letters, numbers, hyphens, and underscores.",
      },
      { status: 400 },
    );
  }
  fs.mkdirSync(PROFILES_DIR, { recursive: true });
  const filePath = path.join(PROFILES_DIR, `${safeName}.json`);
  // Verify resolved path is within PROFILES_DIR (prevent traversal)
  if (!filePath.startsWith(PROFILES_DIR)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return NextResponse.json({ saved: safeName });
}
