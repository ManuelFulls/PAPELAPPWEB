import { NextRequest, NextResponse } from "next/server";
import { PapeleriaModel } from "@/app/lib/mysql";
import { generarNumeroComprobante } from "@/app/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const {
      id_usuario,
      tipoEntrega,
      direccion,
      telefono,
      carrito,
      metodoPago,
      referencia_externa,
      tipoComprobante, // 'ticket' o 'factura'
    } = await request.json();

    if (tipoEntrega === "domicilio") {
      await PapeleriaModel.updateUsuarioDireccionTelefono(
        id_usuario,
        direccion,
        telefono
      );

      // Descontar stock por cada producto del carrito
      for (const item of carrito) {
        await PapeleriaModel.descontarStock(item.id_producto, item.cantidad);
      }
    }
    let isEstado = "";

    if (tipoEntrega === "domicilio ") {
      isEstado = "pagado";
    } else {
      isEstado = "pendiente";
    }
    const fechaActual = new Date();
    const id_pedido = await PapeleriaModel.insertPedido(
      fechaActual,
      isEstado,
      id_usuario,
      tipoEntrega,

      tipoEntrega === "domicilio" ? direccion : null
    );

    let montoTotal = 0;

    for (const item of carrito) {
      const precio = parseFloat(item.precio); // convertir a número por si viene como string
      const total = precio * item.cantidad;
      montoTotal += total;

      await PapeleriaModel.insertDetallePedido(
        id_pedido,
        item.id_producto,
        item.cantidad,
        total
      );
    }

    // ✅ Insertar comprobante
    const numero_comprobante = generarNumeroComprobante(); // puedes hacer uno tipo: CMB-2025062912
    await PapeleriaModel.insertComprobante({
      id_pedido,
      tipo: tipoComprobante || "ticket",
      numero_comprobante,
      fecha_emision: fechaActual,
      total: montoTotal,
    });
    //  window.location.href = `/api/comprobante/${id_pedido}/pdf`;

    return NextResponse.json({
      success: true,
      id_pedido,
      numero_comprobante,
      montoTotal,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Error al procesar el pedido" },
      { status: 500 }
    );
  }
}
