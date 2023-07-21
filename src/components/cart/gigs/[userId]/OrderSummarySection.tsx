"use client";

import { useCart } from "@/hooks/useQuery";
import { useSession } from "next-auth/react";

interface IOrderSummarySectionProps {
  dynamicRoute: {
    userId: string;
  };
}

export default function OrderSummarySection(props: IOrderSummarySectionProps) {
  const { data: session } = useSession();
  const { data } = useCart(session);
  console.log(data);
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
      >
        Checkout
      </button>
    </div>
  );
}
