"use client";

import { useCart } from "@/hooks/useQuery";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { HiXMark } from "react-icons/hi2";
import Link from "next/link";
import { endpoints } from "@/constants/endpoints";
import EmptyStateCard from "@/components/EmptyStateCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ICartItemSectionProps {
  dynamicRoute: {
    userId: string;
  };
}

export default function CartItemSection(props: ICartItemSectionProps) {
  const { data: session } = useSession();
  const { data } = useCart(session);
  const { userId } = props.dynamicRoute;
  const client = useQueryClient();

  const gigsOnCartMutation = useMutation<any, Error, { gigId: string }>({
    mutationFn: async (data) => {
      const res = await fetch(
        endpoints.API.gigsOnCartByGigIdAndUserId(data.gigId, userId),
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        toastId: "userImageSection",
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
    onSuccess: async () => {
      await client.invalidateQueries({queryKey: ["cart", userId]})
      toast.success("item deleted", {
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

  const HiXMarkOnClick = (gigId: string) => {
    gigsOnCartMutation.mutate({
      gigId,
    });
  };

  if (!data?.data?.gigs || data.data.gigs.length < 1) {
    return <EmptyStateCard />;
  }
  return (
    <>
      {data?.data?.gigs.map((el, index) => {
        return (
          <div
            key={index}
            className="p-4 flex flex-row w-full sm:space-x-6 border-t-[1px] border-b-[1px] border-gray-500"
          >
            <Image
              src={el.gig.image}
              alt=""
              className="w-[35%] rounded hidden sm:block object-cover"
              width={500}
              height={500}
            />

            <div className="w-full sm:w-[65%]">
              <div className="flex flex-row justify-between w-full h-fit">
                <p className="text-white font-bold text-xl sm:text-2xl break-all">
                  {el.gig.title}
                </p>
                <div
                  onClick={() => HiXMarkOnClick(el.gig.id)}
                  className="h-fit flex justify-start items-start p-2 transition ease-in-out delay-50 hover:bg-red-400 bg-red-500 cursor-pointer rounded-md"
                >
                  <HiXMark color="white" size={22} />
                </div>
              </div>
              <p className="mt-6 text-gray-500 font-normal text-base sm:text-lg break-all">
                {el.gig.description}
              </p>
              <div className="mt-6 flex flex-row justify-between items-center w-full h-fit">
                <Link
                  href={endpoints.PAGE.gigDetails(
                    el.gig.freelancerProfileId,
                    el.gig.id
                  )}
                  className=" w-fit py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                >
                  View
                </Link>
                <p className=" text-white font-normal text-lg sm:text-xl break-all">
                  {`£ ${Number(el.gig.price).toFixed(2)}`}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
