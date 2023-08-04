"use client"

import EmptyStateCard from "@/components/EmptyStateCard";
import { useFreelancerProfiles } from "@/hooks/useQuery";
import { PaginationState, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Session } from "next-auth";
import Image from "next/image";
import React from "react";
import FreelancerDetailModal from "./FreelancerDetailModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PutFreelancerProfile } from "@/models/FreelancerProfile/PutFreelancerProfileAPI";
import { endpoints } from "@/constants/endpoints";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IFreelancerTableSectionProps {
    session: Session
}

export default function FreelancerTableSection(props: IFreelancerTableSectionProps) {
    const [{ verifiedArray }, setGlobalFilter] = React.useState<{
        verifiedArray: boolean[];
    }>({
        verifiedArray: [true, false],
    });

    console.log(verifiedArray)

    const [{ pageIndex, pageSize }, setPagination] =
        React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });

    const fetchDataOptions = {
        pageIndex,
        pageSize,
        verifiedArray,
    }

    const { data } = useFreelancerProfiles(props.session, fetchDataOptions)

    const [freelancerProfile, setFreelancerProfile] = React.useState<IResponseDataGETFreelancers>();

    const columnHelper =
        createColumnHelper<IResponseDataGETFreelancers>();

    const columns = [columnHelper.accessor("id", {
        cell: (info) => (
            <div className="px-6 py-2">
                <p className="text-sm text-gray-500">{info.getValue()}</p>
            </div>
        ),
        footer: (info) => info.column.id,
        header: () => {
            return (
                <div className="group inline-flex items-start gap-x-2">
                    <span className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200">
                        Freelancer ID
                    </span>
                </div>
            )
        }
    }),
    columnHelper.accessor("user", {
        cell: (info) => (
            <div className="px-6 py-2 flex flex-row space-x-2 items-center">
                <Image
                    alt=""
                    src={info.getValue().image || ""}
                    className="object-cover w-6 h-6 rounded-full"
                    width={100}
                    height={100}
                />
                <p className="text-sm text-gray-500">{info.getValue().name}</p>
            </div>
        ),
        footer: (info) => info.column.id,
        header: () => {
            return (
                <div className="group inline-flex items-start gap-x-2">
                    <span className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200">
                        Name
                    </span>
                </div>
            )
        }
    }),
    columnHelper.accessor("type", {
        cell: (info) => (
            <div className="px-6 py-2">
                <p className="text-sm text-gray-500">{info.getValue()}</p>
            </div>
        ),
        footer: (info) => info.column.id,
        header: () => {
            return (
                <div className="group inline-flex items-start gap-x-2">
                    <span className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200">
                        Type
                    </span>
                </div>
            )
        }
    }),
    columnHelper.accessor("verified", {
        cell: (info) => (
            <div className="px-6 py-3">

                <span className={`${info.getValue() ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'} inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>
                    {info.getValue() ? <svg
                        className="w-2.5 h-2.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg> : <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                    </svg>}
                    {info.getValue().toString()}
                </span>
            </div>
        ),
        footer: (info) => info.column.id,
        header: () => {
            return (
                <div className="group inline-flex items-start gap-x-2">
                    <span className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200">
                        Verified
                    </span>
                </div>
            )
        }
    }),
    columnHelper.accessor("user.id", {
        cell: (info) => {
            return (
                <>
                    <div className="px-6 py-2">
                        <div className="hs-dropdown relative inline-block [--placement:bottom-right]">
                            <button
                                id="hs-table-dropdown-1"
                                type="button"
                                className="hs-dropdown-toggle py-1.5 px-2 inline-flex justify-center items-center gap-2 rounded-md text-gray-700 align-middle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                            >
                                <svg
                                    className="w-4 h-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={16}
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                </svg>
                            </button>
                            <div
                                className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden mt-2 divide-y divide-gray-200 min-w-[10rem] z-20 bg-white shadow-2xl rounded-lg p-2 mt-2 dark:divide-gray-700 dark:bg-gray-800 dark:border dark:border-gray-700"
                                aria-labelledby="hs-table-dropdown-1"
                            >
                                <div className="py-2 first:pt-0 last:pb-0">
                                    <span className="block py-2 px-3 text-xs font-medium uppercase text-gray-400 dark:text-gray-600">
                                        Actions
                                    </span>
                                    <button
                                        className="w-full flex items-center gap-x-3 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                                        onClick={() => {
                                            verifyMutation.mutate({ verified: true, userId: info.getValue() })
                                        }}
                                    >
                                        Verify
                                    </button>
                                    <button
                                        className="w-full flex items-center gap-x-3 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                                        onClick={() => {
                                            verifyMutation.mutate({ verified: false, userId: info.getValue() })
                                        }}
                                    >
                                        Not Verify
                                    </button>
                                    <button
                                        className="w-full flex items-center gap-x-3 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                                        data-hs-overlay="#hs-vertically-centered-scrollable-modal"
                                        onClick={() => {
                                            setFreelancerProfile(info.row.original)
                                        }}
                                    >
                                        More details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        },
        footer: (info) => info.column.id,
        header: () => {
            return <>{""}</>;
        },
    }),
    ]

    const trRef = React.useRef<HTMLTableRowElement>(null);

    const defaultData = React.useMemo(() => [], []);
    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    const handleCheckboxChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        verified: boolean
    ) => {
        if (e.currentTarget.checked) {
            setGlobalFilter((prev) => ({
                ...prev,
                verifiedArray: [...prev.verifiedArray, verified]
            }));
            setPagination({
                pageIndex: 0,
                pageSize: 10,
            });
        } else {
            if (verifiedArray.length > 1) {
                setGlobalFilter((prev) => ({
                    ...prev,
                    verifiedArray: prev.verifiedArray.filter((s) => s !== verified),
                }));
                setPagination({
                    pageIndex: 0,
                    pageSize: 10,
                });
            } else {
                e.currentTarget.checked = true;
            }
        }
    };

    const table = useReactTable({
        data: data?.data || defaultData,
        columns,
        pageCount: data?.pagination?.totalPages || -1,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        onGlobalFilterChange: setGlobalFilter,
    });

    const PageRange = () => {
        const limit = data?.pagination?.limit || 0;
        const page = data?.pagination?.page || 0;
        const total = data?.pagination?.totalItems || 0;

        const start = Number(page) * limit + 1;
        const end = Math.min(start + limit - 1, total);

        return (
            <>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {`${start} - ${end}`}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {total}
                </span>
            </>
        );
    };

    const TRows = () => {
        const numberOfRows = table.getRowModel().rows.length;
        const rows = table.getRowModel().rows.map((row) => {
            return (
                <tr key={row.id} className={`h-[51px]`} ref={trRef}>
                    {row.getVisibleCells().map((cell) => {
                        return (
                            <>
                                <td key={cell.id} className="h-px w-px whitespace-nowrap">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            </>
                        );
                    })}
                </tr>
            );
        });
        if (numberOfRows < pageSize) {
            for (let i = 0; i < pageSize - numberOfRows; i++) {
                rows.push(
                    <tr key={`dummy-row-page${pageIndex}-row${i}`} className={`h-[51px]`}>
                        <td key={`dummy-cell-page${pageIndex}-row${i}`}></td>
                    </tr>
                );
            }
        }
        return rows;
    };

    const client = useQueryClient();

    const verifyMutation = useMutation<any, Error, PutFreelancerProfile & { userId: string }>({
        mutationFn: async (data) => {
            const res = await fetch(endpoints.API.freelancerProfileByUserId(data.userId || ""), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    verified: data.verified,
                }),
            })
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }
            return res.json();
        },
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ["freelancerProfiles", fetchDataOptions]
            })
            toast.success("Verify Updated", {
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
    })

    return (
        <div className="-m-1.5 overflow-x-auto">
            <FreelancerDetailModal freelancerProfile={freelancerProfile} />
            <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
                    {/* Header */}
                    <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 text-sm">
                            {" "}
                        </p>
                        <div>
                            <div className="inline-flex gap-x-2">
                                <div
                                    className="hs-dropdown relative inline-block [--placement:bottom-right]"
                                    data-hs-dropdown-auto-close="inside"
                                >
                                    <button
                                        id="hs-as-table-table-filter-dropdown"
                                        type="button"
                                        className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                                    >
                                        <svg
                                            className="w-3 h-3"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={16}
                                            height={16}
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                        </svg>
                                        Filter
                                    </button>
                                    <div
                                        className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden mt-2 divide-y divide-gray-200 min-w-[12rem] z-20 bg-white shadow-md rounded-lg mt-2 dark:divide-gray-700 dark:bg-gray-800 dark:border dark:border-gray-700"
                                        aria-labelledby="hs-as-table-table-filter-dropdown"
                                    >
                                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                            <label
                                                htmlFor="hs-as-filters-dropdown-frequency"
                                                className="flex py-2.5 px-3"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                                    id="hs-as-filters-dropdown-frequency"
                                                    defaultChecked
                                                    onChange={(e) => handleCheckboxChange(e, true)}
                                                />
                                                <span className="ml-3 text-sm text-gray-800 dark:text-gray-200">
                                                    Verified
                                                </span>
                                            </label>
                                            <label
                                                htmlFor="hs-as-filters-dropdown-status"
                                                className="flex py-2.5 px-3"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                                    id="hs-as-filters-dropdown-status"
                                                    defaultChecked
                                                    onChange={(e) => handleCheckboxChange(e, false)}
                                                />
                                                <span className="ml-3 text-sm text-gray-800 dark:text-gray-200">
                                                    Not verified
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End Header */}
                    {/* Table */}
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-slate-800">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="px-6 py-3 text-left">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {!data || !data.data || data.data.length < 1 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <EmptyStateCard />
                                    </td>
                                </tr>
                            ) : (
                                <TRows />
                            )}
                        </tbody>
                    </table>
                    {/* End Table */}
                    {/* Footer */}
                    {data && data.data && data.data.length > 0 && (
                        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-gray-700">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <PageRange />
                                </p>
                            </div>
                            <div>
                                <div className="inline-flex gap-x-2">
                                    <button
                                        type="button"
                                        className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <svg
                                            className="w-3 h-3"
                                            width={16}
                                            height={16}
                                            viewBox="0 0 16 15"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M10.506 1.64001L4.85953 7.28646C4.66427 7.48172 4.66427 7.79831 4.85953 7.99357L10.506 13.64"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        Prev
                                    </button>
                                    <button
                                        type="button"
                                        className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        Next
                                        <svg
                                            className="w-3 h-3"
                                            width={16}
                                            height={16}
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M4.50598 2L10.1524 7.64645C10.3477 7.84171 10.3477 8.15829 10.1524 8.35355L4.50598 14"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* End Footer */}
                </div>
            </div>
        </div>
    )
}