import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await request.json();
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: body.priceId,
        quantity: body.quantity,
      },
    ],
    mode: "payment",
    success_url: `/`,
    cancel_url: `/`,
  });
  return NextResponse.json(session.url);
}
