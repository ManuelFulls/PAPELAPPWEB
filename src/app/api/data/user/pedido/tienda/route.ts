import { NextRequest, NextResponse } from "next/server";
import { PapeleriaModel } from "@/app/lib/mysql";

export async function POST(request: NextRequest) {
  try {
    const {
      id_usuario,
      tipoEntrega,
      direccion,
      telefono,
      carrito,
      metodoPago,
      referencia_externa, // Agregado para Stripe
    } = await request.json();

    if (tipoEntrega === "domicilio") {
      await PapeleriaModel.updateUsuarioDireccionTelefono(
        id_usuario,
        direccion,
        telefono
      );
    }

    const fechaActual = new Date();
    const id_pedido = await PapeleriaModel.insertPedido(
      fechaActual,
      "pagado",
      id_usuario,
      tipoEntrega,
      tipoEntrega === "domicilio" ? direccion : null
    );

    let montoTotal = 0;

    for (const item of carrito) {
      const precio = await PapeleriaModel.getPrecioProducto(item.id_producto);
      const total = precio * item.cantidad;
      montoTotal += total;

      await PapeleriaModel.insertDetallePedido(
        id_pedido,
        item.id_producto,
        item.cantidad,
        total
      );
    }

    await PapeleriaModel.insertPago(
      id_pedido,
      metodoPago,
      "exitoso",
      fechaActual,
      referencia_externa, // Usar la referencia de Stripe
      montoTotal
    );

    return NextResponse.json({ success: true, id_pedido });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Error al procesar el pedido" },
      { status: 500 }
    );
  }
}
