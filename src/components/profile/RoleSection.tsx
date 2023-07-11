"use client";

import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Select, { Options } from "react-select";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endpoints } from "@/constants/endpoints";

interface OptionProps {
  value: UserRole;
  label: UserRole;
  isDisabled: boolean;
}

const options: Options<OptionProps> = [
  { value: "EMPLOYER", label: "EMPLOYER", isDisabled: false },
  { value: "FREELANCER", label: "FREELANCER", isDisabled: false },
  { value: 'ADMIN' , label: "ADMIN" , isDisabled: true},
];

export default function RoleSection() {
  const [selectedOption, setSelectedOption] = useState<OptionProps | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const { data: session, update } = useSession();
  useEffect(() => {
    if (session?.user.role) {
      setSelectedOption(
        options.find((option) => option.value === session.user.role) || null
      );
    }
  }, [session?.user.role]);

  const editOnClick = async () => {
    if (isEditable) {
      try {
        setIsLoading(true);
        const res = await fetch(endpoints.API.userById(session?.user.sub || ''), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(selectedOption && { role: selectedOption.value }),
          }),
        });
        if (!res.ok) {
          throw new Error("Failed to update user");
        } else {
          await update({
            ...(selectedOption && { role: selectedOption.value }),
          });
          toast.success("Role updated successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      } catch (error: any) {
        toast.error(error.message, {
          toastId: "roleSection",
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } finally {
        setIsLoading(false);
        setIsEditable(false);
      }
    } else {
      setIsEditable(true);
    }
  };
  const cancelOnClick = () => {
    setIsEditable(false);
    if (session?.user.role) {
      setSelectedOption(
        options.find((option) => option.value === session.user.role) || null
      );
    }
  };

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <p className="text-white font-bold text-xl">Role</p>
      <p className="text-gray-400 mt-2">
        To become a freelancer, you need to be approved by one of our admins first.
        Once you are approved, you can switch between buyer and freelancer freely.
      </p>
      <Select
        className="mt-8"
        styles={{
          container: (baseStyles) => ({
            ...baseStyles,
            height: 46,
          }),
          control: (baseStyles) => ({
            ...baseStyles,
            height: "100%",
            backgroundColor: isEditable ? "#0F172A" : "#1F2937",
            borderColor: "#374151",
          }),
          singleValue: (baseStyles) => ({
            ...baseStyles,
            color: "#FFFFFF",
          }),
        }}
        components={{
          IndicatorSeparator: () => null,
        }}
        value={selectedOption}
        onChange={setSelectedOption}
        options={options}
        isDisabled={!isEditable}
      />
      <p className="text-gray-400 mt-3">
        Want to become a freelancer?&nbsp;&nbsp;
        <Link href={"/"} className="text-blue-600 font-semibold">
          Click here
        </Link>
      </p>
      <div className="mt-6 flex flex-row space-x-4">
        <button
          type="button"
          className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          onClick={editOnClick}
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
    </div>
  );
}
