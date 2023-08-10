"use client"

import { endpoints } from "@/constants/endpoints";
import { useFreelancerProfile } from "@/hooks/useQuery";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const { data: session } = useSession();
  const freelancerProfile = useFreelancerProfile(session);

  return (
    <footer className="dark:bg-gray-800 flex mt-auto">
      <div className="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
          <div className="col-span-full hidden lg:col-span-1 lg:block">
            <Link
              className="flex-none text-xl font-semibold dark:text-white"
              href="/"
              aria-label="Brand"
            >
              Freelancerth
            </Link>
            <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              © 2023 By Pavaruth Buranakitsin.
            </p>
          </div>
          {/* End Col */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
              Gig
            </h4>
            <div className="mt-3 grid space-y-3 text-sm">
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  href={endpoints.PAGE.createGig()}
                >
                  Create a Gig
                </a>
              </p>
              <p>
                <Link
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  href={endpoints.PAGE.browseGigs(0)}
                >
                  Browse Gigs
                </Link>
              </p>
            </div>
          </div>
          {/* End Col */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
              Freelancer
            </h4>
            <div className="mt-3 grid space-y-3 text-sm">
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  href={endpoints.PAGE.registerFreelancer()}
                >
                  Become a Freelancer
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  href={endpoints.PAGE.freelancerProfilePage(
                    freelancerProfile.data?.data?.id || "invalid"
                  )}
                >
                  My Freelancer Profile
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  href={endpoints.PAGE.customerOrder(
                    freelancerProfile.data?.data?.id || "invalid"
                  )}
                >
                  My Customer Order
                </a>
              </p>
              <p>
                <a
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  href={endpoints.PAGE.mangeGigs(
                    freelancerProfile.data?.data?.id || "invalid"
                  )}
                >
                  Manage my Gigs
                </a>
              </p>
            </div>
          </div>
          {/* End Col */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
              Employer
            </h4>
            <div className="mt-3 grid space-y-3 text-sm">
              <p>
                <Link
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  href={endpoints.PAGE.profile(session?.user.sub || "unknown")}
                >
                  My Profile
                </Link>
              </p>
              <p>
                <Link
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  href={endpoints.PAGE.gigCart(session?.user.sub || "")}
                >
                  My Cart
                </Link>
              </p>
              <p>
                <Link
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  href={endpoints.PAGE.orderHistory(session?.user.sub || "")}
                >
                  My Order History
                </Link>
              </p>
            </div>
          </div>
          {/* End Col */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
              Admin
            </h4>
            <div className="mt-3 grid space-y-3 text-sm">
              <p>
                <Link
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  href={endpoints.PAGE.adminDashboard()}
                >
                  Dashboard
                </Link>
              </p>
              <p>
                <Link
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  href={endpoints.PAGE.adminFreelancers()}
                >
                  Manage Freelancers
                </Link>
              </p>
            </div>
          </div>
          {/* End Col */}
        </div>
        {/* End Grid */}
        <div className="pt-5 mt-5 border-t border-gray-200 dark:border-gray-700">
          <div className="sm:flex sm:justify-between sm:items-center">
            <div className="flex items-center gap-x-3">
              {/* Language Dropdown */}
              <div className="hs-dropdown relative inline-flex [--placement:top-left]">
                <button
                  id="footer-language-dropdown"
                  type="button"
                  className="hs-dropdown-toggle py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border bg-white text-gray-700 align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                >
                  English (UK)
                  <svg
                    className="hs-dropdown-open:rotate-180 w-2.5 h-2.5 text-gray-600"
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 11L8.16086 5.31305C8.35239 5.13625 8.64761 5.13625 8.83914 5.31305L15 11"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div
                  className="hs-dropdown-menu w-40 transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 bg-white shadow-md rounded-lg p-2 dark:bg-gray-800 dark:border dark:border-gray-700 dark:divide-gray-700"
                  aria-labelledby="footer-language-dropdown"
                >
                  <a
                    className="flex items-center gap-x-2 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    href="#"
                  >
                    English (UK)
                  </a>
                </div>
              </div>
              {/* End Language Dropdown */}
            </div>
            <div className="flex justify-between items-center">
              <div className="mt-3 sm:hidden">
                <a
                  className="flex-none text-xl font-semibold dark:text-white"
                  href="#"
                  aria-label="Brand"
                >
                  Freelancerth
                </a>
                <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  © 2023 By Pavaruth Buranakitsin.
                </p>
              </div>
              {/* Social Brands */}
              <div className="space-x-4 flex">
                <Link
                  className="inline-block text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                  href="https://uk.linkedin.com/in/pavaruth-buranakitsin-a717a8188"
                >
                  <FaLinkedin size={16} />
                </Link>
                <Link
                  className="inline-block text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                  href="https://github.com/P-Buranakitsin"
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </Link>
              </div>
              {/* End Social Brands */}
            </div>
            {/* End Col */}
          </div>
        </div>
      </div>
    </footer>
  );
}
