"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DescriptionSchema, Description } from "@/models/Description";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { endpoints } from "@/constants/endpoints";

export default function DescriptionSection() {
  const { data: session } = useSession();
  async function getProfileByUserId() {
    const res = await fetch(endpoints.profileByUserId(session?.user.sub || ''), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const profiles = (await res.json()) as IResponseDataGETProfileByUserId;
    return profiles;
  }
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfileByUserId(),
    enabled: !!session,
  });

  const [isEditable, setIsEditable] = useState<boolean>(false);

  const DescriptionForm = ({ initData }: { initData: string }) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<Description>({
      resolver: zodResolver(DescriptionSchema),
      defaultValues: {
        description: initData,
      },
    });

    const client = useQueryClient();

    const mutation = useMutation<any, Error, Description>({
      mutationFn: async (data) => {
        const res = await fetch(endpoints.profileByUserId(session?.user.sub || ''), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: data.description,
          }),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }
        return res.json();
      },
      onSuccess: async () => {
        await client.invalidateQueries({ queryKey: ["profile"] });
        toast.success("Description Updated", {
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
        mutation.mutate(data);
      } else {
        setIsEditable(true);
      }
    });

    const cancelOnClick = () => {
      setIsEditable(false);
    };

    return (
      <form onSubmit={onSubmit}>
        <textarea
          {...register("description", { disabled: !isEditable })}
          className={`disabled:bg-gray-800 placeholder-gray-500 border-[1px] mt-3 py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white`}
          rows={4}
          placeholder="Write your description here."
        />
        {errors.description?.message && (
          <p className="text-xs font-semibold text-red-600 mt-2">
            {errors.description.message}
          </p>
        )}
        <div className="mt-6 flex flex-row space-x-4">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          >
            {mutation.isLoading && (
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
      <p className="text-white font-bold text-xl">Description</p>
      <p className="text-gray-400 mt-2">
        Write anything that you would like other users to know.
      </p>
      {data && (
        <DescriptionForm initData={data.data?.description || ""} />
      )}
    </div>
  );
}
