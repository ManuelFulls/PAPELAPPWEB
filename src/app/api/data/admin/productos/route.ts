// /app/api/data/admin/productos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PapeleriaModel } from "@/app/lib/mysql";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Obtener campos del formulario
    const nombre = formData.get("nombre") as string;
    const descripcion = formData.get("descripcion") as string;
    const precio = parseFloat(formData.get("precio") as string);
    const cantidad = parseInt(formData.get("cantidad") as string);
    const categoria = parseInt(formData.get("categoria") as string);
    const marca = parseInt(formData.get("marca") as string);
    const imagenFile = formData.get("imagen") as File;

    // Validaciones
    if (
      !nombre ||
      !descripcion ||
      !precio ||
      !cantidad ||
      !categoria ||
      !marca
    ) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    if (!imagenFile || imagenFile.size === 0) {
      return NextResponse.json(
        { error: "No se recibió ninguna imagen válida" },
        { status: 400 }
      );
    }

    // Convertir File a Buffer
    const arrayBuffer = await imagenFile.arrayBuffer();
    const imagenBuffer = Buffer.from(arrayBuffer);

    // Procesar imagen con sharp
    const resizedImageBuffer = await sharp(imagenBuffer)
      .resize(500)
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // Guardar producto
    const resultado = await PapeleriaModel.newProducto({
      nombre,
      descripcion,
      precio,
      cantidad,
      categoria,
      marca,
      imagen: resizedImageBuffer, // Ya está procesada
    });

    if (resultado) {
      return NextResponse.json(
        { message: "Producto creado correctamente" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Error al guardar producto" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error en procesamiento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const productos = await PapeleriaModel.getProductos();

  if (productos) {
    const productosConImagen = productos.map((producto: any) => ({
      ...producto,
      imagen: producto.imagen
        ? `data:image/jpeg;base64,${Buffer.from(producto.imagen).toString(
            "base64"
          )}`
        : null, // o "" si prefieres no mandar null
    }));

    return NextResponse.json(
      { message: "Productos Encontrados", data: productosConImagen },
      { status: 200 }
    );
  } else {
    return NextResponse.json({ error: "Ocurrió un error" }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();

  const { id_producto } = body;
  const res = await PapeleriaModel.deleteProducto(id_producto);

  if (res) {
    return NextResponse.json(
      { message: "Producto eliminado correctamente" },
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
//DD

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    // Obtener campos, incluyendo el id del producto
    const id_producto = parseInt(formData.get("id_producto") as string);
    const nombre = formData.get("nombre") as string;
    const descripcion = formData.get("descripcion") as string;
    const precio = parseFloat(formData.get("precio") as string);
    const cantidad = parseInt(formData.get("cantidad") as string);
    const categoria = parseInt(formData.get("categoria") as string);
    const marca = parseInt(formData.get("marca") as string);
    const imagenFile = formData.get("imagen") as File | null;

    // Validaciones mejoradas
    if (!id_producto || isNaN(id_producto)) {
      return NextResponse.json(
        { error: "ID del producto es requerido y debe ser válido" },
        { status: 400 }
      );
    }

    if (!nombre || !descripcion) {
      return NextResponse.json(
        { error: "Nombre y descripción son requeridos" },
        { status: 400 }
      );
    }

    if (isNaN(precio) || precio <= 0) {
      return NextResponse.json(
        { error: "El precio debe ser un número válido mayor a 0" },
        { status: 400 }
      );
    }

    if (isNaN(cantidad) || cantidad < 0) {
      return NextResponse.json(
        { error: "La cantidad debe ser un número válido mayor o igual a 0" },
        { status: 400 }
      );
    }

    if (isNaN(categoria) || isNaN(marca)) {
      return NextResponse.json(
        { error: "Categoría y marca deben ser válidas" },
        { status: 400 }
      );
    }

    let imagenBuffer = undefined;

    // Solo procesar imagen si se envió una nueva
    if (imagenFile && imagenFile.size > 0) {
      try {
        // Validar tipo de archivo
        if (!imagenFile.type.startsWith("image/")) {
          return NextResponse.json(
            { error: "El archivo debe ser una imagen válida" },
            { status: 400 }
          );
        }

        // Validar tamaño (ej: máximo 5MB)
        if (imagenFile.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: "La imagen no debe superar los 5MB" },
            { status: 400 }
          );
        }

        const arrayBuffer = await imagenFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        imagenBuffer = await sharp(buffer)
          .resize(500)
          .toFormat("jpeg", { quality: 80 })
          .toBuffer();
      } catch (imageError) {
        console.error("Error procesando imagen:", imageError);
        return NextResponse.json(
          { error: "Error al procesar la imagen" },
          { status: 400 }
        );
      }
    }

    // Llamar al método updateProducto
    const resultado = await PapeleriaModel.updateProducto({
      id_producto,
      nombre,
      descripcion,
      precio,
      cantidad,
      categoria,
      marca,
      imagen: imagenBuffer,
    });

    if (resultado) {
      return NextResponse.json(
        { message: "Producto actualizado correctamente" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error:
            "No se pudo actualizar el producto. Verifica que el ID sea correcto.",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error en procesamiento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
