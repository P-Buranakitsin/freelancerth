"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { BasicInfo, BasicInfoSchema } from "@/models/BasicInfo";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { endpoints } from "@/constants/endpoints";

export default function BasicInfoSection() {
  const { data: session, update } = useSession();
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const BasicInfoForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<BasicInfo>({
      resolver: zodResolver(BasicInfoSchema),
      defaultValues: {
        firstName: session?.user.name?.split(" ")[0] || "",
        lastName: session?.user.name?.split(" ")[1] || "",
      },
    });

    const mutation = useMutation<any, Error, BasicInfo>({
      mutationFn: async (data) => {
        const updatedName = data.firstName + " " + data.lastName;
        const res = await fetch(endpoints.userById(session?.user.sub || ''), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedName,
            ...(session?.user.email && { email: session.user.email }),
          }),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }
        return res.json();
      },
      onSuccess: async (res) => {
        const updatedName =
          (res.data?.user.name?.split(" ")[0] || "") +
          " " +
          (res.data?.user.name?.split(" ")[1] || "");
        await update({
          name: updatedName,
        });
        toast.success("info updated", {
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
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {" "}
          <div className="mt-4 flex flex-col">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              First Name
            </label>
            <input
              {...register("firstName", { disabled: !isEditable })}
              type="text"
              className=" disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
              placeholder="Bonnie"
            />
            {errors.firstName?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="md:mt-4 flex flex-col">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              Last Name
            </label>
            <input
              {...register("lastName", { disabled: !isEditable })}
              type="text"
              className="disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
              placeholder="Green"
            />
            {errors.lastName?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div className=" flex flex-col md:col-span-2">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              Email (Not allowed to be changed at the moment)
            </label>
            <input
              disabled
              value={session?.user.email || ""}
              type="text"
              className="disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
              placeholder="you@site.com"
            />
            {errors.email?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row md:col-span-2 mt-6 justify-end space-x-2">
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
        </div>
      </form>
    );
  };

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <p className="text-white font-bold text-xl">Basic Information</p>
      {session && <BasicInfoForm />}
    </div>
  );
}
