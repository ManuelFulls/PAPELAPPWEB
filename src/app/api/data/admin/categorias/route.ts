import { NextRequest, NextResponse } from "next/server";
import { PapeleriaModel } from "@/app/lib/mysql";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { nombre, descripcion } = body;

  const res = await PapeleriaModel.newCategoria({ nombre, descripcion });

  if (res) {
    return NextResponse.json(
      { message: "Categoria creada correctamente" },
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

export async function GET(request: NextRequest) {
  const res = await PapeleriaModel.getCategorias();

  if (res) {
    return NextResponse.json(
      { message: "Categoria encontradas correctamente", data: res },
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

export async function DELETE(request: NextRequest) {
  const body = await request.json();

  const { id_categoria } = body;
  const res = await PapeleriaModel.deleteCategoria(id_categoria);

  if (res) {
    return NextResponse.json(
      { message: "Categoria eliminada correctamente" },
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

export async function PUT(request: NextRequest) {
  const body = await request.json();
  console.log("dd ", body);
  const { id_categoria, nombre, descripcion } = body;
  const res = await PapeleriaModel.updateCategoria({
    id_categoria,
    nombre,
    descripcion,
  });

  if (res) {
    return NextResponse.json(
      { message: "Categoria modificada correctamente" },
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
