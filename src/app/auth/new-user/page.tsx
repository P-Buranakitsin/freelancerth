"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { BsPersonCircle } from "react-icons/bs";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { ImBin } from "react-icons/im";

export default function VerifyRequest() {
  const router = useRouter();
  const [image, setImage] = useState<File | string | null>(null);
  const { data: session, status } = useSession();
  const imageInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    console.log('ffgdg')
    if (session?.user?.image) {
      setImage(session.user.image);
    }
  }, [session?.user?.image]);

  const skip = () => {
    router.push("/");
  };

  const selectImage = (event: FormEvent<HTMLInputElement>) => {
    if (
      event.currentTarget.files &&
      event.currentTarget.files.length > 0 &&
      event.currentTarget.files[0].type.includes("image")
    ) {
      setImage(event.currentTarget.files[0]);
    } else if (session?.user?.image) {
      setImage(session.user.image);
    } else {
      setImage(null);
    }
  };

  const removeImage = (event: FormEvent<HTMLButtonElement>) => {
    if (session?.user?.image) {
      setImage(session.user.image);
    } else {
      setImage(null);
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  return (
    <main className="w-full max-w-lg mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Welcome
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please fill in your information{" "}
            </p>
            {image ? (
              <img
                className="inline-block h-[5rem] w-[5rem] rounded-full ring-2 ring-white dark:ring-gray-800 mt-5"
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt="Profile pic"
              />
            ) : (
              <BsPersonCircle
                className="inline-block h-[5rem] w-[5rem] rounded-full ring-2 ring-white dark:ring-gray-800 mt-5"
                color="white"
              />
            )}
          </div>

          <div className="mt-5">
            {/* Form */}
            <form>
              <div className="grid gap-y-4">
                <div className="">
                  <div className="block text-sm mb-2 dark:text-white">
                    Profile picture
                  </div>
                  <div className="flex">
                    <label htmlFor="image" className="sr-only">
                      Choose file
                    </label>
                    <input
                      type="file"
                      name="image"
                      ref={imageInputRef}
                      accept="image/*"
                      id="image"
                      onChange={selectImage}
                      className="block w-full border border-gray-200 shadow-sm rounded-l-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400
    file:bg-transparent file:border-0
    file:bg-gray-100 file:mr-4
    file:py-3 file:px-4
    dark:file:bg-gray-700 dark:file:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="inline-flex flex-shrink-0 justify-center items-center h-[2.875rem] w-[2.875rem] rounded-r-md border border-transparent font-semibold bg-red-500 text-white hover:bg-red-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                    >
                      <ImBin width={16} height={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    First name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue={session?.user?.name?.split(" ")[0] || ""}
                      id="first_name"
                      name="first_name"
                      className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                      required
                      aria-describedby="first_name-error"
                    />
                    <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                      <svg
                        className="h-5 w-5 text-red-500"
                        width={16}
                        height={16}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>
                  <p
                    className="hidden text-xs text-red-600 mt-2"
                    id="first_name-error"
                  >
                    Please include a valid first name
                  </p>
                </div>
                {/* End Form Group */}
                {/* Form Group */}
                <div>
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="last_name"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Last name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      defaultValue={session?.user?.name?.split(" ")[1] || ""}
                      className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                      required
                      aria-describedby="last_name-error"
                    />
                    <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                      <svg
                        className="h-5 w-5 text-red-500"
                        width={16}
                        height={16}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>
                  <p
                    className="hidden text-xs text-red-600 mt-2"
                    id="last_name-error"
                  >
                    Please include a valid last name
                  </p>
                </div>
                {/* End Form Group */}
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-4">
                  <button
                    type="button"
                    onClick={skip}
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
            {/* End Form */}
          </div>
        </div>
      </div>
    </main>
  );
}
