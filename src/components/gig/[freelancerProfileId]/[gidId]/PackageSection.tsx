"use client";

import { HiArrowSmRight } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/constants/endpoints";
import { useSession } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
interface IPackageSectionProps {
  dynamicRoute: {
    freelancerProfileId: string;
    gigId: string;
  };
  gigData: IResponseDataGETGigs;
}

export default function PackageSection(props: IPackageSectionProps) {
  const { price } = props.gigData;
  const { gigId } = props.dynamicRoute;
  const { data: session } = useSession();
  const client = useQueryClient();
  const router = useRouter();

  const cartMutation = useMutation<any, Error, IRequestPUTCartByUserId>({
    mutationFn: async (data) => {
      const res = await fetch(
        endpoints.API.cartByUserId(session?.user.sub || ""),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gigId: data.gigId,
          }),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ["cart", session?.user.sub || ""],
      });
      toast.success("Info Updated", {
        toastId: "descriptionSection",
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      router.push(endpoints.PAGE.gigCart(session?.user.sub || ""));
    },
    onError: (error) => {
      toast.error(error.message, {
        toastId: "descriptionSection",
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

  const continueOnClick = (data: IRequestPUTCartByUserId) => {
    cartMutation.mutate(data);
  };

  return (
    <div className="flex flex-col bg-gray-800 border rounded-xl border-gray-700 sticky top-[120px]">
      <nav
        className="relative z-0 flex border rounded-xl overflow-hidden dark:border-gray-700"
        aria-label="Tabs"
        role="tablist"
      >
        <button
          type="button"
          className="hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-white first:border-l-0 border-l border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-400 active"
          id="bar-with-underline-item-1"
          data-hs-tab="#bar-with-underline-1"
          aria-controls="bar-with-underline-1"
          role="tab"
        >
          Basic
        </button>
        <button
          type="button"
          className="hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-white first:border-l-0 border-l border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-400 dark:hover:text-gray-300"
          id="bar-with-underline-item-2"
          data-hs-tab="#bar-with-underline-2"
          aria-controls="bar-with-underline-2"
          role="tab"
        >
          Intermediate
        </button>
        <button
          type="button"
          className="hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-white first:border-l-0 border-l border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-400 dark:hover:text-gray-300"
          id="bar-with-underline-item-3"
          data-hs-tab="#bar-with-underline-3"
          aria-controls="bar-with-underline-3"
          role="tab"
        >
          Advanced
        </button>
      </nav>
      <div className="m-6">
        <div
          id="bar-with-underline-1"
          role="tabpanel"
          aria-labelledby="bar-with-underline-item-1"
        >
          <div className="flex flex-row justify-between">
            <p className="text-gray-500 dark:text-gray-400">Basic Package</p>
            <p className="text-gray-500 dark:text-gray-400">
              £&nbsp;{Number(price).toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            className="mt-7 w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
            onClick={() => continueOnClick({ gigId })}
            disabled={cartMutation.isLoading}
          >
            Continue
            <HiArrowSmRight size={24} />
          </button>
        </div>
        <div
          id="bar-with-underline-2"
          className="hidden"
          role="tabpanel"
          aria-labelledby="bar-with-underline-item-2"
        >
          <p className="text-gray-500 dark:text-gray-400">Coming Soon</p>
        </div>
        <div
          id="bar-with-underline-3"
          className="hidden"
          role="tabpanel"
          aria-labelledby="bar-with-underline-item-3"
        >
          <p className="text-gray-500 dark:text-gray-400">Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
