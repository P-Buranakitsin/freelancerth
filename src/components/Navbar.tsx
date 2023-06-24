"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { BiLogOut } from "react-icons/bi";
import { BsPersonCircle } from "react-icons/bs";
import { ImProfile } from "react-icons/im";

export default function Navbar() {
  const { data: session, status } = useSession();
  const handleSigninOnClick = () => {
    signIn();
  };

  const handleSignoutOnClick = () => {
    signOut();
  };

  return (
    <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white border-b border-gray-200 text-sm py-3 sm:py-0 dark:bg-gray-800 dark:border-gray-700">
      <nav
        className="relative max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex items-center justify-between">
          <a
            className="flex-none text-xl font-semibold dark:text-white"
            href="#"
            aria-label="Brand"
          >
            Brand
          </a>
          <div className="sm:hidden">
            <button
              type="button"
              className="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
              data-hs-collapse="#navbar-collapse-with-animation"
              aria-controls="navbar-collapse-with-animation"
              aria-label="Toggle navigation"
            >
              <svg
                className="hs-collapse-open:hidden w-4 h-4"
                width={16}
                height={16}
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                />
              </svg>
              <svg
                className="hs-collapse-open:block hidden w-4 h-4"
                width={16}
                height={16}
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
          </div>
        </div>
        <div
          id="navbar-collapse-with-animation"
          className="pl-2 hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block"
        >
          <div className="flex flex-col gap-y-4 gap-x-0 mt-5 sm:flex-row sm:items-center sm:gap-y-0 sm:gap-x-7 sm:mt-0 sm:pl-7">
            <a
              className="font-medium text-blue-600 sm:py-6 dark:text-blue-500"
              href="#"
              aria-current="page"
            >
              Landing
            </a>
            <a
              className="font-medium text-gray-500 hover:text-gray-400 sm:py-6 dark:text-white dark:hover:text-gray-300"
              href="#"
            >
              Account
            </a>
            <a
              className="font-medium text-gray-500 hover:text-gray-400 sm:py-6 dark:text-white dark:hover:text-gray-300"
              href="#"
            >
              Work
            </a>
            <a
              className="font-medium text-gray-500 hover:text-gray-400 sm:py-6 dark:text-white dark:hover:text-gray-300"
              href="#"
            >
              Blog
            </a>

            <div
              className={`flex items-center gap-x-2 sm:ml-auto pr-2 ${
                status === "authenticated"
                  ? "-sm:border-t-[1px] -sm:border-white"
                  : ""
              } `}
            >
              {status !== "authenticated" ? (
                <button className="p-2 border-white border-2 cursor-pointer rounded-md hover:bg-gray-600 transition ease-in-out duration-500">
                  <div
                    className="flex items-center gap-x-2 font-medium text-gray-500  dark:text-white "
                    onClick={handleSigninOnClick}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                    </svg>
                    Log in
                  </div>
                </button>
              ) : (
                <div
                  className="hs-dropdown relative inline-flex sm:pt-0 pt-4 items-center sm:cursor-pointer"
                  data-hs-dropdown-placement="bottom-right"
                  id="open-profile"
                >
                  <button
                    id="hs-dropdown-with-header"
                    type="button"
                    className="-sm:cursor-default inline-flex flex-shrink-0 justify-center items-center gap-2 h-[2.375rem] w-[2.375rem] rounded-full font-medium sm:hover:bg-white/[.2] text-white align-middle focus:outline-none sm:focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all text-xs"
                  >
                    {session.user.image ? (
                      <Image
                        className="inline-block h-[2.375rem] w-[2.375rem] rounded-full"
                        src={session.user.image || ""}
                        width={200}
                        alt="pic"
                        height={200}
                      />
                    ) : (
                      <BsPersonCircle
                        className="inline-block h-[2.375rem] w-[2.375rem] rounded-full"
                        color="white"
                      />
                    )}
                  </button>
                  <div className="flex flex-col">
                    <p className="sm:hidden font-medium text-gray-500 sm:hover:text-gray-400 sm:py-6 dark:text-gray-400 dark:sm:hover:text-gray-300 ml-2">
                      Signed in as
                    </p>
                    <p className="sm:hidden font-medium text-gray-500 sm:hover:text-gray-400 sm:py-6 dark:text-white dark:sm:hover:text-gray-300 ml-2">
                      {session.user.email}
                    </p>
                  </div>

                  <div
                    className="-sm:hidden hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[15rem] z-10 bg-white shadow-md rounded-lg p-2 dark:bg-gray-800 dark:border dark:border-gray-700"
                    aria-labelledby="hs-dropdown-with-header"
                  >
                    <div className="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg dark:bg-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Signed in as
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
                        {session.user.email}
                      </p>
                    </div>
                    <div className="mt-2 py-2 first:pt-0 last:pb-0">
                      <a
                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        href="#"
                      >
                        <ImProfile size={16} className="flex-none" />
                        <div>My Profile</div>
                      </a>
                      <a
                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        onClick={handleSignoutOnClick}
                        id="signout"
                      >
                        <BiLogOut size={16} className="flex-none" />
                        <div>Log Out</div>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {status === "authenticated" && (
              <>
                <a
                  className="sm:hidden font-medium text-gray-500 hover:text-gray-400 sm:py-6 dark:text-white dark:hover:text-gray-300"
                  href="#"
                >
                  My Profile
                </a>
                <button
                  className="sm:hidden mb-2 flex font-medium text-gray-500 hover:text-gray-400 sm:py-6 dark:text-white dark:hover:text-gray-300"
                  onClick={handleSignoutOnClick}
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
