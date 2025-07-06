import { PapeleriaModel } from "@/app/lib/mysql";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { correo, nombre, password, apPaterno, apMaterno } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  // Guardar usuario en la base de datos
  const res = await PapeleriaModel.addUsuario({
    correo,
    nombre,
    hashedPassword,
    apPaterno,
    apMaterno,
  });

  console.log(res);

  if (!res) {
    return NextResponse.json({ error: "Ocurrió un error" }, { status: 401 });
  }

  // 🔐 Generar token JWT
  const secret: any = process.env.SECRET_KEY_JWT;
  //
  const token = jwt.sign(
    {
      email: correo,
      id_usuario: res,
      rol: "cliente",
    },
    secret,
    { expiresIn: "24h" }
  );

  //  Crear cookie

  const serialized = serialize("myTokenName", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24h
    path: "/",
  });

  const response = NextResponse.json(
    { message: "Registrado correctamente", redirectUrl: "/usuario/Home" },
    { status: 200 }
  );

  response.headers.set("Set-Cookie", serialized);

  return response;
}
