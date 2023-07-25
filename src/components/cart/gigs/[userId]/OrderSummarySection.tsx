"use client";

import { endpoints } from "@/constants/endpoints";
import { useCart } from "@/hooks/useQuery";
import getStripe from "@/utils/get-stripejs";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Stripe from "stripe";

interface IOrderSummarySectionProps {
  dynamicRoute: {
    userId: string;
  };
}

export default function OrderSummarySection(props: IOrderSummarySectionProps) {
  const { data: session } = useSession();
  const { data } = useCart(session);
  console.log(data);
  const checkoutOnClick = () => {
    if (!data?.data?.gigs || data.data.gigs.length < 1) {
      toast.error("no item to checkout", {
        toastId: "newUser",
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    const body: IRequestPOSTCheckoutSessions = {
      lineItems: [],
      metaData: {
        userId: session?.user.sub || "",
        freelancersId: [],
        gigsId: [],
      },
    };

    data.data.gigs.forEach((el) => {
      const gigPrice = Number((el.gig.price * 1.2).toFixed(2)) * 100;
      const lineItem = {
        quantity: 1,
        price_data: {
          currency: "GBP",
          product_data: {
            name: el.gig.title,
            description: el.gig.description,
            images: el.gig.image ? [el.gig.image] : undefined,
          },
          unit_amount_decimal: String(gigPrice),
        },
      };
      body.lineItems.push(lineItem);
      body.metaData.gigsId.push(el.gig.id);
      body.metaData.freelancersId.push(el.gig.freelancerProfileId);
    });
    body.metaData.freelancersId = [...new Set(body.metaData.freelancersId)];
    body.metaData.freelancersId = JSON.stringify(body.metaData.freelancersId);
    body.metaData.gigsId = JSON.stringify(body.metaData.gigsId);

    checkoutSessionMutation.mutate(body);
  };

  const checkoutSessionMutation = useMutation<
    { message: string; data: Stripe.Checkout.Session },
    Error,
    IRequestPOSTCheckoutSessions
  >({
    mutationFn: async (body) => {
      const res = await fetch(endpoints.API.checkoutSessions(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: async (res) => {
      toast.success("success", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      // Redirect to Checkout.
      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: res.data.id,
      });
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `error.message`.
      console.warn(error.message);
    },
    onError: (error) => {
      toast.error(error.message, {
        toastId: "newUser",
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  });
  return (
    <div className="flex flex-col bg-gray-800 border rounded-xl border-gray-700 p-6 sticky top-[100px]">
      <p className=" text-white font-bold text-lg sm:text-xl break-all ">
        Order Summary
      </p>
      <div className="space-y-2 mt-6 border-b-[1px] border-gray-500 pb-4">
        <div className="flex flex-row justify-between items-center">
          <p className=" text-gray-400 font-medium text-base sm:text-lg break-all ">
            Subtotal
          </p>
          <p className=" text-gray-400 font-medium text-base sm:text-lg break-all ">
            {`£ ${Number(data?.data?.subtotalPrice || 0).toFixed(2)}`}
          </p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <p className=" text-gray-400 font-medium text-base sm:text-lg break-all ">
            Service fee (20%)
          </p>
          <p className=" text-gray-400 font-medium text-base sm:text-lg break-all ">
            {`£ ${Number(data?.data?.totalServiceFee || 0).toFixed(2)}`}
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center mt-4">
        <p className=" text-gray-300 font-semibold text-base sm:text-lg break-all ">
          Total
        </p>
        <p className=" text-gray-300 font-semibold text-base sm:text-lg break-all ">
          {`£ ${Number(data?.data?.totalPrice || 0).toFixed(2)}`}
        </p>
      </div>
      <button
        type="button"
        className="mt-4 w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-base dark:focus:ring-offset-gray-800"
        onClick={checkoutOnClick}
        disabled={
          checkoutSessionMutation.isLoading ||
          !data?.data?.gigs ||
          data.data.gigs.length < 1
        }
      >
        {checkoutSessionMutation.isLoading && (
          <span
            className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
            role="status"
            aria-label="loading"
          ></span>
        )}
        Checkout
      </button>
    </div>
  );
}
