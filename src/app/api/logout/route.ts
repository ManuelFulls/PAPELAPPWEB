import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { verify } from "jsonwebtoken";
import { serialize } from "cookie";
import { cookies } from "next/headers";
export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("myTokenName");

  if (!token) {
    return NextResponse.json(
      {
        error: "no token",
      },
      {
        status: 401,
      }
    );
  }

  try {
    cookieStore.delete("myTokenName");

    const response = NextResponse.json({ message: "Salir" }, { status: 200 });
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Token invalid" }, { status: 401 });
  }
}
