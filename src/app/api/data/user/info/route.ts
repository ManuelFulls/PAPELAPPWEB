import { NextRequest, NextResponse } from "next/server";
import { PapeleriaModel } from "@/app/lib/mysql";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id_producto = searchParams.get("id_producto");

  if (!id_producto) {
    return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
  }

  const res = await PapeleriaModel.BuscarProductoID(Number(id_producto));

  if (res) {
    const productoConImagen = {
      ...res,
      imagen: res.imagen
        ? `data:image/jpeg;base64,${Buffer.from(res.imagen).toString("base64")}`
        : null, // o "" si prefieres no enviar null
    };

    return NextResponse.json(
      { message: "Producto encontrado", data: productoConImagen },
      { status: 200 }
    );
  } else {
    return NextResponse.json({ error: "Ocurrió un error" }, { status: 401 });
  }
}
