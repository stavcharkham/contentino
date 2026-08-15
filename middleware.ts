import { NextResponse, type NextRequest } from "next/server";

// Protects the dashboard pages only. The API routes keep their own checks:
// Slack signatures, the cron bearer secret, and the interactivity signature.
export const config = { matcher: ["/((?!api/|_next/|favicon.ico).*)"] };

export function middleware(request: NextRequest): NextResponse {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return NextResponse.next();
  const header = request.headers.get("authorization") ?? "";
  const encoded = header.startsWith("Basic ") ? header.slice(6) : "";
  const supplied = Buffer.from(encoded, "base64").toString("utf8").split(":").slice(1).join(":");
  if (supplied === password) return NextResponse.next();
  return new NextResponse("Contentino needs the shared password.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Contentino"' },
  });
}
