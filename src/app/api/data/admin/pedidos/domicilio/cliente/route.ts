import { NextRequest, NextResponse } from "next/server";
import { PapeleriaModel } from "@/app/lib/mysql";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id_pedido = searchParams.get("id_pedido");

  if (!id_pedido) {
    return NextResponse.json(
      { error: "Falta el parámetro id_pedido" },
      { status: 400 }
    );
  }
  const res = await PapeleriaModel.getPedidoByID(id_pedido);

  if (res) {
    return NextResponse.json(
      { message: "Pedidos encontrados", data: res },
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
