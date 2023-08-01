"use client";

import { endpoints } from "@/constants/endpoints";
import { useFreelancerProfile } from "@/hooks/useQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "next-auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

interface IFinanceSectionProps {
  session: Session;
}

export default function FinanceSection(props: IFinanceSectionProps) {
  const { data } = useFreelancerProfile(props.session);
  const router = useRouter();
  const client = useQueryClient();

  const createConnectedAccountMutation = useMutation<
    IResponsePOSTCreateConnectedAccount,
    Error,
    IRequestPOSTCreateConnectedAccount
  >({
    mutationFn: async (data) => {
      const res = await fetch(endpoints.API.createConnectedAccount(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: async (res) => {
      if (!res.data) {
        throw new Error("internal server error");
      }
      router.push(res.data.url);
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

  const loginStripeMutation = useMutation<IResponsePOSTCreateLoginLink, Error, IRequestPOSTCreateLoginLink>({
    mutationFn: async (data) => {
      const res = await fetch(endpoints.API.createLoginLink(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: async (res) => {
      if (!res.data) {
        throw new Error("internal server error");
      }
      window.open(res.data.url);
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
  })

  const withdrawMutation = useMutation<IResponsePOSTWithdraw, Error, IRequestPOSTWithdraw>({
    mutationFn: async (data) => {
      const res = await fetch(
        endpoints.API.withdraw(),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: async () => {
      toast.success("Money has been transferred to your account. Please wait a few days for it to show up in your balance.", {
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
      setTimeout(function () {
        client.invalidateQueries({
          queryKey: [
            "freelancerProfileByUserId",
            props.session?.user.sub || "",
          ],
        });
      }, 1000);
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
  })

  const registerOrLoginOnClick = () => {
    if (data?.data?.stripeRegistered) {
      loginStripeMutation.mutate({ accountId: data.data.stripeAccountId || "" })
    } else {
      createConnectedAccountMutation.mutate({
        stripAccountId: data?.data?.stripeAccountId || "",
        freelancerId: data?.data?.id || "",
      });
    }
  };

  const withdrawOnClick = () => {
    withdrawMutation.mutate({
      accountId: data?.data?.stripeAccountId || "",
      amount: Number(data?.data?.balance || "0").toFixed(2),
      freelancerId: data?.data?.id || "",
    })
  }

  const isRegisterLoading = createConnectedAccountMutation.isLoading || loginStripeMutation.isLoading
  const isWithdrawLoading = withdrawMutation.isLoading

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <p className="text-white font-bold text-xl">Finance</p>
      {data?.data?.stripeRegistered ? (
        <>
          <p className="text-gray-400 mt-2">
            You already have a Stripe account. Please click the button below to
            login.
          </p>
        </>
      ) : (
        <>
          <p className="text-gray-400 mt-2">
            You need to register a Stripe account first to be able to withdraw
            money.
          </p>
        </>
      )}

      <button
        type="button"
        className="mt-3 py-[.688rem] px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-blue-500 hover:text-white hover:bg-blue-500 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:border-gray-700 dark:hover:border-blue-500"
        onClick={registerOrLoginOnClick}
        disabled={isRegisterLoading}
      >
        {isRegisterLoading && (
          <>
            <span
              className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
              role="status"
              aria-label="loading"
            ></span>
          </>
        )}
        {data?.data?.stripeRegistered ? "Login" : "Register"}
      </button>
      <div className="flex flex-col space-y-4 mt-6">
        <div className="flex flex-row justify-between">
          <p className="block font-semibold dark:text-gray-400">Balance</p>
          <p className="block font-medium dark:text-gray-400">
            £ {Number(data?.data?.balance || 0).toFixed(2)}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="block font-semibold dark:text-gray-400">
            Total Received
          </p>
          <p className="block font-medium dark:text-gray-400">
            £ {Number(data?.data?.totalAmountReceived || 0).toFixed(2)}
          </p>
        </div>
        <button
          type="button"
          className="mt-3 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          disabled={isWithdrawLoading}
          onClick={withdrawOnClick}
        >
          {isWithdrawLoading && (
            <>
              <span
                className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
                role="status"
                aria-label="loading"
              ></span>
            </>
          )}
          Withdraw
        </button>
      </div>
    </div>
  );
}
