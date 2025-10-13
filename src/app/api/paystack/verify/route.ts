import axios from "axios";
import { db } from "@/server/db";
import { env } from "@/env";

export const POST = async (request: Request) => {
  const { reference } = await request.json();

  // Check if Paystack is configured
  if (!env.PAYSTACK_SECRET_KEY) {
    return new Response("Paystack is not configured. Please set PAYSTACK_SECRET_KEY in your environment variables.", { status: 500 });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { message, data } = response.data;

    if (message === "Verification successful") {
      // Extract payment details from Paystack response
      const {
        amount,
        currency,
        customer: { email },
        reference: transactionId,
        status,
      } = data;

      // Create donation record in database (public donation, no user required)
      const donation = await db.donation.create({
        data: {
          userId: null, // Public donation, no user authentication required
          amount: amount / 100, // Convert from kobo to currency unit
          currency: currency || "GHS",
          paymentMethod: "paystack",
          status: status === "success" ? "COMPLETED" : "PENDING",
          transactionId,
          donorEmail: email,
          donorName: null, // Will be set from metadata if provided
        },
      });

      return new Response(
        JSON.stringify({
          data: {
            ...data,
            donationId: donation.id,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response("Payment verification failed!", { status: 400 });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
