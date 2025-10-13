import axios from "axios";
import { db } from "@/server/db";
import { env } from "@/env";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const POST = async (request: Request) => {
  const { email, amount } = await request.json();

  if (!email) return new Response("email is required", { status: 400 });
  if (!amount) return new Response("Invalid amount", { status: 400 });

  // Check if Paystack is configured
  if (!env.PAYSTACK_SECRET_KEY) {
    return new Response("Paystack is not configured. Please set PAYSTACK_SECRET_KEY in your environment variables.", { status: 500 });
  }

  try {
    // Prepare the request payload according to Paystack documentation
    const payload = {
      email,
      amount: amount * 100, // Convert to kobo
      currency: "GHS",
      callback_url: `${SERVER_URL || 'http://localhost:3000'}/donate/success`,
    };

    console.log("Initializing Paystack payment with payload:", {
      ...payload,
      amount: `${amount * 100} kobo (${amount} GHS)`,
    });

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      payload,
      {
        headers: {
          Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(
      JSON.stringify({
        data: response.data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Paystack initialization error:", error);
    
    if (error.response?.status === 403) {
      return new Response("Invalid Paystack API key. Please check your PAYSTACK_SECRET_KEY.", { status: 500 });
    }
    
    return new Response(`Paystack error: ${error.message}`, { status: 500 });
  }
};
