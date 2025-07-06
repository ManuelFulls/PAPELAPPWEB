import { NextRequest, NextResponse } from "next/server";
import { PapeleriaModel } from "@/app/lib/mysql";

export async function GET(request: NextRequest) {
  //const body = await request.json();

  const res = await PapeleriaModel.getPedidosAdmin();
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
  const body = await request.json();
  //console.log(" RR ", body);
  const { id_pedido, estado, productos } = body;

  //actualizar pedido como pagado
  const res = await PapeleriaModel.actualizarEstadoPedido(id_pedido, estado);

  //actualizar stock de los productos
  // Descontar stock de cada producto

  if (res) {
    return NextResponse.json({ message: "Pedido cancelado" }, { status: 200 });
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
