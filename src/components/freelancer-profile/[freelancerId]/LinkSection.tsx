"use client";

import { endpoints } from "@/constants/endpoints";
import { useFreelancerProfile } from "@/hooks/useQuery";
import { PutFreelancerProfile, PutFreelancerProfileSchema } from "@/models/FreelancerProfile/PutFreelancerProfileAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ILinkSectionProps {
  session: Session;
}

export default function LinkSection(props: ILinkSectionProps) {
  const { data } = useFreelancerProfile(props.session);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const LinkForm = ({
    initData,
  }: {
    initData: {
      linkedInURL: string;
      githubURL: string;
      portfolioURL: string;
    };
  }) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<PutFreelancerProfile>({
      resolver: zodResolver(PutFreelancerProfileSchema),
      defaultValues: initData,
    });

    const client = useQueryClient();

    const linkMutation = useMutation<any, Error, PutFreelancerProfile>({
      mutationFn: async (data) => {
        const res = await fetch(
          endpoints.API.freelancerProfileByUserId(props.session.user.sub || ""),
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              linkedInURL: data.linkedInURL,
              githubURL: data.githubURL,
              portfolioURL: data.portfolioURL,
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
          queryKey: [
            "freelancerProfileByUserId",
            props.session?.user.sub || "",
          ],
        });
        toast.success("Link(s) Updated", {
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
      onSettled: () => {
        setIsEditable(false);
      },
    });

    const onSubmit = handleSubmit(async (data) => {
      if (isEditable) {
        console.log(data);
        linkMutation.mutate(data);
      } else {
        setIsEditable(true);
      }
    });

    const cancelOnClick = () => {
      setIsEditable(false);
    };

    return (
      <form onSubmit={onSubmit} className="mt-3">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              LinkedIn URL
            </label>
            <input
              {...register("linkedInURL", {
                disabled: !isEditable,
                value: initData.linkedInURL,
              })}
              type="text"
              className=" disabled:dark:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:disabled:text-white"
              placeholder=""
            />
            {errors.linkedInURL?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.linkedInURL.message}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              Github URL
            </label>
            <input
              {...register("githubURL", {
                disabled: !isEditable,
                value: initData.githubURL,
              })}
              type="text"
              className=" disabled:dark:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:disabled:text-white"
              placeholder=""
            />
            {errors.githubURL?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.githubURL.message}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              Portfolio URL
            </label>
            <input
              {...register("portfolioURL", {
                disabled: !isEditable,
                value: initData.portfolioURL,
              })}
              type="text"
              className=" disabled:dark:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:disabled:text-white"
              placeholder=""
            />
            {errors.portfolioURL?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.portfolioURL.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-row space-x-4 justify-end">
          <button
            type="submit"
            disabled={linkMutation.isLoading}
            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          >
            {linkMutation.isLoading && (
              <>
                <span
                  className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
                  role="status"
                  aria-label="loading"
                ></span>
              </>
            )}
            {isEditable ? "Save Changes" : "Edit"}
          </button>
          {isEditable && (
            <button
              type="button"
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm dark:text-white dark:hover:bg-gray-900 dark:hover:border-gray-900 dark:focus:ring-gray-900 dark:focus:ring-offset-gray-800"
              onClick={cancelOnClick}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    );
  };

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <p className="text-white font-bold text-xl">Links</p>
      {data?.data && (
        <LinkForm
          initData={(({ linkedInURL, githubURL, portfolioURL }) => ({
            linkedInURL,
            githubURL,
            portfolioURL,
          }))(data.data)}
        />
      )}
    </div>
  );
}
