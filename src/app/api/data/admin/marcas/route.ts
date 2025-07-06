import { NextRequest, NextResponse } from "next/server";
import { PapeleriaModel } from "@/app/lib/mysql";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { nombre } = body;

  const res = await PapeleriaModel.addMarca(nombre);

  if (res) {
    return NextResponse.json(
      { message: "Marca creada correctamente" },
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

export async function GET() {
  const marcas = await PapeleriaModel.getMarcas();
  if (marcas) {
    return NextResponse.json(
      { message: "Marca creada correctamente", data: marcas },
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
  const { id_marca } = body;

  const res = await PapeleriaModel.deleteMarca(id_marca);
  if (res) {
    return NextResponse.json(
      { message: "Marca eliminada correctamente" },
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
  const { id_marca, nombre } = body.data;
  console.log("3 ", body);
  console.log("DATOS A ACTUALIZAR, ", id_marca, nombre);

  const res = await PapeleriaModel.updateMarca({ id_marca, nombre });
  if (res) {
    return NextResponse.json(
      { message: "Marca actualizada correctamente" },
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
