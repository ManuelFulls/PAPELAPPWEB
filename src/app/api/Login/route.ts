import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import bcrypt from "bcrypt";
import { PapeleriaModel } from "@/app/lib/mysql";

export async function POST(request: Request) {
  const body = await request.json();
  const { correo, password } = body;

  //console.log("Datos recibidos:", body);

  const user = await PapeleriaModel.Login(correo);
  // console.log("Resultado del login:", user);

  if (!user) {
    return NextResponse.json(
      { message: "No tiene una cuenta" },
      { status: 404 }
    );
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword || user.password === null) {
    return NextResponse.json(
      { message: "Password incorrecta" },
      { status: 401 }
    );
  }

  const rol = user.tipo_usuario;
  const secret: any = process.env.SECRET_KEY_JWT;

  const token = jwt.sign(
    {
      email: user.correo,
      id_usuario: user.id_usuario,
      rol,
    },
    secret,
    { expiresIn: "24h" }
  );

  const serialized = serialize("myTokenName", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24h
    path: "/",
  });
  //console.log("Token generado:", user);
  const redirectUrl =
    rol === "admin" ? "/administrador/productos" : "/usuario/Home";

  const response = NextResponse.json(
    { message: "login successfully", redirectUrl },
    { status: 200 }
  );

  response.headers.set("Set-Cookie", serialized);
  return response;
}
