"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DescriptionSchema, Description } from "@/models/Description";
import { zodResolver } from "@hookform/resolvers/zod";

export default function DescriptionSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Description>({ resolver: zodResolver(DescriptionSchema) });
  const onSubmit = handleSubmit((data) => {
    if (isEditable) {
      console.log(data);
      setIsEditable(false);
    } else {
      setIsEditable(true);
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const cancelOnClick = () => {
    setIsEditable(false);
    reset();
  };

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <p className="text-white font-bold text-xl">Description</p>
      <p className="text-gray-400 mt-2">
        Write anything that you would like other users to know.
      </p>
      <form onSubmit={onSubmit}>
        <textarea
          {...register("description", { disabled: !isEditable })}
          className={` mt-3 py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400`}
          rows={4}
          placeholder="Write your description here."
        />
        <div className="mt-6 flex flex-row space-x-4">
          <button
            type="submit"
            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          >
            {isLoading && (
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
      {errors.description?.message && (
        <p className="text-xs font-semibold text-red-600 mt-2">
          {errors.description.message}
        </p>
      )}
    </div>
  );
}
