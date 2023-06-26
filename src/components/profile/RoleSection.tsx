"use client";

import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Select, { Options } from "react-select";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface OptionProps {
  value: UserRole;
  label: UserRole;
  isDisabled: boolean;
}

const options: Options<OptionProps> = [
  { value: "BUYER", label: "BUYER", isDisabled: false },
  { value: "SELLER", label: "SELLER", isDisabled: true },
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
        const res = await fetch("/api/user/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(session?.user.email && { email: session.user.email }),
            ...(selectedOption && { role: selectedOption.value }),
          }),
        });
        if (!res.ok) {
          throw new Error("Failed to update user");
        } else {
          await update({
            ...(selectedOption && { role: selectedOption.value }),
          });
        }
      } catch (error: any) {
        toast.error(error.message, {
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
  };

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <p className="text-white font-bold text-xl">Role</p>
      <p className="text-gray-400 mt-2">
        To become a seller, you need to be approved by one of our admins first.
        Once you are approved, you can switch between buyer and seller freely.
      </p>
      <Select
        className="mt-8"
        value={selectedOption}
        onChange={setSelectedOption}
        options={options}
        isDisabled={!isEditable}
      />
      <p className="text-gray-400 mt-3">
        Want to become a seller?&nbsp;&nbsp;
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
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
