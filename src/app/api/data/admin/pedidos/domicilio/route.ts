import { NextRequest, NextResponse } from "next/server";
import { PapeleriaModel } from "@/app/lib/mysql";

export async function GET(request: NextRequest) {
  //const body = await request.json();

  const res = await PapeleriaModel.getPedidosAdminDomicilio();
  //console.log(" re  ", res);

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

export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  //const id_pedido = searchParams.get("id_pedido");
  const body = await request.json();
  const id_pedido = body.id_pedido;
  console.log(" PEDI ", id_pedido);
  if (!id_pedido) {
    return NextResponse.json(
      { error: "Falta el parámetro id_pedido" },
      { status: 400 }
    );
  }
  const res = await PapeleriaModel.actualizarEstadoPedido(id_pedido, "enviado");
  //console.log(" re  ", res);

  if (res) {
    return NextResponse.json(
      { message: "Pedido marcado como enviado" },
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
