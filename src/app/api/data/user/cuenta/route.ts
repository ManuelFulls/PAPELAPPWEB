import { NextRequest, NextResponse } from "next/server";
import { PapeleriaModel } from "@/app/lib/mysql";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id_usuario = searchParams.get("id_usuario");

  console.log("id_usuario:", id_usuario);

  if (!id_usuario) {
    return NextResponse.json(
      { error: "ID de usuario no proporcionado" },
      { status: 400 }
    );
  }

  const res = await PapeleriaModel.BuscarUserID(Number(id_usuario));

  if (res) {
    return NextResponse.json(
      { message: "Usuario encontrado", data: res },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      {
        error: "Ocurrio un error",
      },
      {
        status: 401,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      id_usuario,
      nombre,
      apPaterno,
      apMaterno,
      telefono,
      correo,
      direccion,
    } = await request.json();

    if (!id_usuario || !nombre || !apPaterno || !apMaterno || !correo) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const res = await PapeleriaModel.updateUsuario({
      id_usuario,
      nombre,
      apPaterno,
      apMaterno,
      telefono,
      correo,
      direccion,
    });

    if (!res) {
      return NextResponse.json(
        { error: "Error al actualizar usuario" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Datos actualizados correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error actualizar usuario:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
