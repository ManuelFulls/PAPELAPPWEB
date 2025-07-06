import { NextRequest, NextResponse } from "next/server";
import { PapeleriaModel } from "@/app/lib/mysql";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id_usuario = searchParams.get("id_usuario");

  if (!id_usuario) {
    return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
  }

  const domicilio = await PapeleriaModel.getPedidosDomicilio(
    Number(id_usuario)
  );

  const tienda = await PapeleriaModel.getPedidosTienda(Number(id_usuario));

  if (domicilio && tienda) {
    return NextResponse.json(
      { message: "Pedidos encontrados", domicilio: domicilio, tienda: tienda },
      { status: 200 }
    );
  } else {
    return NextResponse.json({ error: "Ocurrió un error" }, { status: 401 });
  }
}
