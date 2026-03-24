import { NextResponse } from "next/server";

const API_TOKEN = process.env.API_TOKEN || "dev-token";

export function authenticateRequest(request: Request): NextResponse | null {
  // Allow GET requests without auth (read-only is safe)
  if (request.method === "GET") return null;

  const token =
    request.headers.get("x-api-token") ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token || token !== API_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // authenticated
}
