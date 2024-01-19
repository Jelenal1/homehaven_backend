import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Cors from "cors";
import { NextApiRequest } from "next";

// Initialize CORS middleware
const cors = Cors({
  methods: ["GET", "POST", "HEAD", "OPTIONS"], // Add other methods as needed
  origin: "*", // Adjust according to your needs
});

// Helper function to run CORS middleware
const runMiddleware = (req: NextRequest, res: NextResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Run the middleware
  await runMiddleware(request, response, cors);

  return response;
}

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
    success_url: `https://homehaven-liard.vercel.app`,
    cancel_url: `https://homehaven-liard.vercel.app`,
  });
  return NextResponse.json(session.url);
}
