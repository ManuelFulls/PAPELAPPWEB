// Archivo: /app/api/data/admin/pedidos/domicilio/cancelar.ts
import { NextRequest, NextResponse } from "next/server";
import { PapeleriaModel } from "@/app/lib/mysql";

export async function POST(request: NextRequest) {
  try {
    const { id_pedido } = await request.json();

    if (!id_pedido) {
      return NextResponse.json(
        { error: "Falta el id del pedido" },
        { status: 400 }
      );
    }

    // Obtener los productos del pedido
    const detalles = await PapeleriaModel.getDetallePedido(id_pedido);

    // Reponer stock por cada producto
    for (const item of detalles) {
      await PapeleriaModel.reponerStock(item.id_producto, item.cantidad);
    }

    // Cambiar estado del pedido a cancelado
    await PapeleriaModel.actualizarEstadoPedido(id_pedido, "cancelado");

    return NextResponse.json(
      { message: "Pedido cancelado y productos repuestos" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al cancelar pedido domicilio:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
