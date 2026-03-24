import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { authenticateRequest } from "@/lib/auth";

const PROFILES_DIR = path.join(process.cwd(), "profiles");

function safePath(name: string): string | null {
  const clean = name.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!clean) return null;
  const full = path.join(PROFILES_DIR, `${clean}.json`);
  if (!full.startsWith(PROFILES_DIR)) return null;
  return full;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const filePath = safePath(name);
  if (!filePath || !fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const authError = authenticateRequest(request);
  if (authError) return authError;
  const { name } = await params;
  const filePath = safePath(name);
  if (!filePath) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  const data = await request.json();
  fs.mkdirSync(PROFILES_DIR, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return NextResponse.json({ saved: name });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const authError = authenticateRequest(request);
  if (authError) return authError;
  const { name } = await params;
  const filePath = safePath(name);
  if (!filePath || !fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  fs.unlinkSync(filePath);
  return NextResponse.json({ deleted: name });
}
