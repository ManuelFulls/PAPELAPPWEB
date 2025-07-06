// /app/api/data/admin/productos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PapeleriaModel } from "@/app/lib/mysql";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id_pedido = searchParams.get("id_pedido");

  if (!id_pedido) {
    return NextResponse.json(
      { error: "Falta el parámetro id_pedido" },
      { status: 400 }
    );
  }

  try {
    const detalles = await PapeleriaModel.getDetallePedidos(id_pedido);

    const detallesConImagen = detalles.map((detalle: any) => ({
      ...detalle,
      imagen: detalle.imagen
        ? `data:image/jpeg;base64,${Buffer.from(detalle.imagen).toString(
            "base64"
          )}`
        : null,
    }));

    return NextResponse.json(
      { message: "Detalles del pedido encontrados", data: detallesConImagen },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener detalles del pedido:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener los detalles del pedido" },
      { status: 500 }
    );
  }
}
