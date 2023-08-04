"use client"

import { endpoints } from "@/constants/endpoints"
import Link from "next/link"
import { SiFreelancer } from "react-icons/si"

declare interface ISidebarProps {
    pathname: string
}


export default function Sidebar(props: ISidebarProps) {

    window.addEventListener('open.hs.overlay', ($sidebarEl) => {
        const element = document.getElementById('application-sidebar')
        element?.classList.add('opacity-50')
    })
    window.addEventListener('close.hs.overlay', ($sidebarEl) => {
        const element = document.getElementById('application-sidebar')
        element?.classList.remove('opacity-50')
    })

    return (
        <>
            <div className="sticky top-0 inset-x-0 z-20 bg-white border-y px-4 sm:px-6 md:px-8 lg:hidden dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center py-4">
                    {/* Navigation Toggle */}
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-600"
                        data-hs-overlay="#application-sidebar"
                        aria-controls="application-sidebar"
                        aria-label="Toggle navigation"
                    >
                        <span className="sr-only">Toggle Navigation</span>
                        <svg
                            className="w-5 h-5"
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
                    </button>
                    {/* End Navigation Toggle */}
                    {/* Breadcrumb */}
                    <ol
                        className="ml-3 flex items-center whitespace-nowrap min-w-0"
                        aria-label="Breadcrumb"
                    >
                        <li
                            className="text-sm font-semibold text-gray-800 truncate dark:text-gray-400"
                            aria-current="page"
                        >
                            {props.pathname === endpoints.PAGE.adminDashboard() ? "Dashboard" : props.pathname === endpoints.PAGE.adminFreelancers() ? "Freelancers" : ""}
                        </li>
                    </ol>
                    {/* End Breadcrumb */}
                </div>
            </div>
            <>
                {/* Sidebar */}
                <div
                    id="application-sidebar"
                    className="hs-overlay  hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 left-0 bottom-0 z-[60] w-64 bg-white border-r border-gray-200 pt-7 pb-10 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 lg:right-auto lg:bottom-0 dark:scrollbar-y dark:bg-gray-800 dark:border-gray-700"
                >
                    <div className="px-6">
                        <Link
                            className="flex-none text-xl font-semibold dark:text-white"
                            href="/"
                            aria-label="Brand"
                        >
                            Freelancerth
                            <span className="text-gray-500 text-sm">&nbsp;Admin</span>
                        </Link>
                    </div>
                    <nav
                        className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
                        data-hs-accordion-always-open=""
                    >
                        <ul className="space-y-1.5">
                            <li>
                                <Link
                                    className={`${props.pathname === endpoints.PAGE.adminDashboard() ? "dark:bg-gray-900 text-white" : "dark:hover:bg-gray-900 dark:bg-gray-800 text-gray-400"} flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm rounded-md`}
                                    href={endpoints.PAGE.adminDashboard()}
                                >
                                    <svg
                                        className="w-3.5 h-3.5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={16}
                                        height={16}
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
                                        />
                                    </svg>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className={`${props.pathname === endpoints.PAGE.adminFreelancers() ? "dark:bg-gray-900 text-white" : "dark:hover:bg-gray-900 dark:bg-gray-800 text-slate-400"} flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm rounded-md`}
                                    href={endpoints.PAGE.adminFreelancers()}
                                >
                                    <SiFreelancer size={16} />
                                    Freelancers
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                {/* End Sidebar */}
            </>

        </>


    )
}