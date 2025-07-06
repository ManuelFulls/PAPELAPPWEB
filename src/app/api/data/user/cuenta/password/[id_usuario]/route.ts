import { PapeleriaModel } from "@/app/lib/mysql";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id_usuario: string }> } // 👈 params es ahora una Promise
) {
  try {
    const { password } = await request.json();
    const params = await context.params; // 👈 await para obtener los parámetros
    const id_usuario = parseInt(params.id_usuario); // 👈 usar params.id_usuario

    //console.log("ID usuario:", id_usuario, password);

    if (!password || !id_usuario) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const res = await PapeleriaModel.updateContraseña({
      id_usuario,
      password: hashedPassword,
    });

    if (!res) {
      return NextResponse.json({ error: "Ocurrió un error" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Contraseña actualizada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
