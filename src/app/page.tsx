"use client";

import CheckoutButton from "@/components/checkout";
import { DummyProducts } from "@/utils/dummyData";
import { ProductTypes } from "@/utils/types";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useState } from "react";
import ChatBot from "react-chatbotify";

export default function Home() {
  const [selectedProducts, setSelectedProducts] = useState<ProductTypes[]>([]);

  const selectProduct = useCallback((id: string) => {
    setSelectedProducts((prev: ProductTypes[]) => {
      if (prev.length && prev.find((item) => item.id === id)) {
        return prev.filter((item) => item.id !== id);
      }
      return [
        ...prev,
        DummyProducts.find((item) => item.id === id),
      ] as ProductTypes[];
    });
  }, []);

  return (
    <>
      <Head>
        <title>Next Stripe</title>
      </Head>
      <div className="flex flex-col h-screen bg-white justify-center items-center">
        <ChatBot />
        <div className="flex">
          {DummyProducts.map((prod) => {
            return (
              <div
                key={prod.id}
                className={`flex flex-col justify-center rounded-md gap-2 border-black border-2 bg-slate-100 pb-3 m-2 ${
                  selectedProducts.find((item) => item.id === prod.id)
                    ? "border-blue-400"
                    : "border-black"
                }`}
                onClick={() => selectProduct(prod.id)}
              >
                <Image
                  src={prod.image}
                  alt={prod.title}
                  height={500}
                  width={500}
                  className="w-[250px] h-[350px] rounded-tl-md rounded-tr-md"
                />
                <p className="text-2xl p-2 font-medium">{prod.title}</p>
                <p className="pl-2">Price: {prod.price}$</p>
              </div>
            );
          })}
        </div>
        <div>
          <CheckoutButton selectedProducts={selectedProducts} />
        </div>
      </div>
    </>
  );
}
