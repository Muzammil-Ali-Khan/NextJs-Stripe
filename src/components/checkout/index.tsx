"use client";

import { ProductTypes } from "@/utils/types";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";

const asyncStripe = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

interface CheckoutButton {
  selectedProducts: ProductTypes[];
}

const CheckoutButton = ({ selectedProducts }: CheckoutButton) => {
  const router = useRouter();

  const handler = async () => {
    try {
      const stripe = await asyncStripe;
      const res = await fetch("/api/stripe/session", {
        method: "POST",
        body: JSON.stringify({
          selectedProducts,
          email: "testuser@gmail.com",
        }),
        headers: { "Content-Type": "application/json" },
      });
      const { sessionId } = await res.json();

      const response = await stripe?.redirectToCheckout({ sessionId });
      console.log(response?.error);
      if (response?.error) {
        router.push("/error");
      }
    } catch (err) {
      console.log(err);
      router.push("/error");
    }
  };

  return (
    <button
      onClick={handler}
      className="bg-blue-700 hover:bg-blue-800 duration-200 px-8 py-4 text-white"
    >
      Checkout
    </button>
  );
};

export default CheckoutButton;
