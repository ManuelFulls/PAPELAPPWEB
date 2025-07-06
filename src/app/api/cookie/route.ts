// Ejemplo: /api/auth/me
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("myTokenName");
  if (!cookie) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const secret = process.env.SECRET_KEY_JWT as string;
    const decoded = jwt.verify(cookie.value, secret);
    return NextResponse.json({ data: decoded });
  } catch (err) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
