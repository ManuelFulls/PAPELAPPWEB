import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Falta la clave secreta de Stripe en el entorno");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function POST(request: NextRequest) {
  try {
    // Obtener los datos del body de la petición
    const body = await request.json();
    const { carrito, tipoEntrega, direccion, telefono, usuario } = body;

    /*   console.log("Datos recibidos:", {
      carrito,
      tipoEntrega,
      direccion,
      telefono,
      usuario,
    });*/

    // Verificar que el carrito no esté vacío
    if (!carrito || carrito.length === 0) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    // Crear line_items desde el carrito SIN IMÁGENES
    const lineItems = carrito.map((item: any) => {
      const precio = item.precio || item.price || 20;
      const cantidad = item.cantidad || item.quantity || 1;

      /*     console.log(
        `Item: ${
          item.nombre || item.name
        }, Precio: ${precio}, Cantidad: ${cantidad}`
      );*/

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.nombre || item.name || "Producto",
            description: `Entrega: ${tipoEntrega}`,
            // NO incluir imágenes para evitar el error
          },
          unit_amount: Math.round(precio * 100), // Convertir a centavos
        },
        quantity: cantidad,
      };
    });

    //  console.log("Line items creados:", lineItems.length);

    const session = await stripe.checkout.sessions.create({
      success_url: "http://localhost:3000/usuario/Home?success=true",
      cancel_url: "http://localhost:3000/usuario/Home",
      line_items: lineItems,
      mode: "payment",
      metadata: {
        tipoEntrega,
        direccion: direccion || "",
        telefono: telefono || "",
        usuario: usuario || "anonimo",
      },
    });

    //  console.log("Sesión creada:", session.id);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      status: 200,
    });
  } catch (error) {
    console.error("Error creando sesión de Stripe:", error);
    return NextResponse.json(
      { error: "Error al crear la sesión de pago" },
      { status: 500 }
    );
  }
}
