import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil", // Versión actualizada
});

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json(); // monto en centavos

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "mxn", // ajusta a tu moneda
      payment_method_types: ["card"],
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear PaymentIntent" },
      { status: 500 }
    );
  }
}
