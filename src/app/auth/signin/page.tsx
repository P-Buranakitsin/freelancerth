"use client";

import { signIn } from "next-auth/react";
import { BiErrorCircle } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Signin, SigninSchema } from "@/models/Signin";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Signin>({
    resolver: zodResolver(SigninSchema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const error = useSearchParams().get("error");

  const signInWithProvider = async (provider: string, email?: string) => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: "/", email });
    setIsLoading(false);
  };

  const signInWithGoogle = () => signInWithProvider("google");
  const signInWithFacebook = () => signInWithProvider("facebook");

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithProvider("email", data.email);
    } catch (e) {
      alert(e);
    }
  });

  useEffect(() => {
    if (error) {
      toast.error("login failed", {
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
  }, [error]);

  return (
    <main className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400"> </p>
          </div>
          <div className="mt-5">
            {/* Form */}
            <form onSubmit={onSubmit}>
              <div className="grid gap-y-4">
                {/* Form Group */}
                <div>
                  <div className="block text-sm mb-2 dark:text-white">
                    Email address
                  </div>
                  <div className="relative">
                    <input
                      className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                      {...register("email")}
                    />
                    {errors.email?.message && (
                      <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                        <BiErrorCircle className="text-red-500" size={24} />
                      </div>
                    )}
                  </div>
                  {errors.email?.message && (
                    <p className="text-xs text-red-600 mt-2">
                      {errors.email?.message}
                    </p>
                  )}
                </div>
                {/* End Form Group */}
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                >
                  Sign in with email
                </button>
              </div>
            </form>
            {/* End Form */}
            <div className="py-3 flex items-center text-xs text-gray-400 before:flex-[1_1_0%] before:border-t before:border-gray-200 before:mr-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ml-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
              Or continue with
            </div>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
              <button
                type="button"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                onClick={signInWithGoogle}
                id="sign-in-google"
              >
                <FcGoogle size={20} />
                Google
              </button>

              <button
                type="button"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                onClick={signInWithFacebook}
              >
                <FaFacebook color="#3b5998" size={20} />
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
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
    </main>
  );
}
