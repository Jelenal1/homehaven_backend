import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const params = request.nextUrl.searchParams;
  const productName = decodeURIComponent(params.get("name") as string);
  console.log(productName);
  const products = await stripe.products.list();
  const product = products.data.find((o) => o.name === productName);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  const price = await stripe.prices.retrieve(product.default_price as string);
  return NextResponse.json({
    price_in_cents: price.unit_amount,
    price_id: price.id,
  });
}
