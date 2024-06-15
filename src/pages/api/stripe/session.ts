import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY ?? "");
const host = process.env.NEXT_PUBLIC_HOST;

export default async function handler(req, res) {
  const { method, body } = req;
  if (method === "POST") {
    try {
      const date = new Date().toISOString();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: body?.email,
        line_items: body?.selectedProducts.map((prod) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: prod.title + date,
            },
            unit_amount: prod?.price * 100 || 100,
          },
          quantity: 1,
        })),
        mode: "payment",
        cancel_url: `${host}`,
        success_url: `${host}/success`,
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      res.status(500).json({ error: "Error checkout session" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
