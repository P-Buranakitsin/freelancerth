"use client";

import { endpoints } from "@/constants/endpoints";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { Fragment } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";

export default function GigSection() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 0;
  const limit = Number(searchParams.get("limit")) || 6;
  const router = useRouter();

  async function getGigs(page: number, limit: number) {
    const res = await fetch(endpoints.gigs(page, limit), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const gigs = (await res.json()) as IResponseDataGETGigs;
    return gigs;
  }

  const { data } = useQuery({
    queryKey: ["gigs", page],
    queryFn: () => getGigs(page, limit),
    keepPreviousData: true,
    enabled: !!session,
  });

  const PaginatedItems = ({ itemsPerPage }: { itemsPerPage: number }) => {
    const handlePageClick = (event: any) => {
      router.push(`gigs?page=${event.selected}&limit=${itemsPerPage}`);
    };

    const pageCount = Math.ceil((data?.total || 0) / itemsPerPage);

    return (
      <>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 mt-4">
          <GigCard currentItems={data?.data || []} />
        </div>
        <div className=" mt-[60px] mb-8">
          <ReactPaginate
            containerClassName="flex flex-row justify-end gap-8 flex-wrap text-gray-500"
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel="Previous"
            renderOnZeroPageCount={null}
            forcePage={page}
            marginPagesDisplayed={2}
            activeClassName="text-blue-500 font-bold"
          />
        </div>
      </>
    );
  };

  const GigCard = ({ currentItems }: { currentItems: any[] }) => {
    return currentItems.map((el, index) => {
      return (
        <Fragment key={`gig-card-${index}`}>
          <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
            <div className="flex h-[200px] items-center justify-center">
              {el.image && (
                <Image
                  className="w-full h-[inherit] rounded-t-xl "
                  src={el.image}
                  alt=""
                  width={400}
                  height={400}
                />
              )}
            </div>
            <div className="p-4 md:p-5 border-t-2 border-gray-700 bg-slate-900 rounded-br-[inherit] rounded-bl-[inherit] flex-grow">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {el.title}
              </h3>
              <div className="flex flex-row gap-3 items-center">
                {session?.user.image && (
                  <Image
                    className=" h-[inherit] rounded-full "
                    src={session.user.image}
                    alt=""
                    width={30}
                    height={30}
                  />
                )}
                <p className="text-gray-500 text-ellipsis overflow-hidden">
                  {session?.user.email?.split("@")[0]}
                </p>
              </div>
              <div className="flex flex-row gap-3 mt-2 mb-4 flex-wrap">
                {el.searchTags.map((tag: any, index: any) => {
                  return (
                    <span
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-500 text-white"
                      key={`tag-${index}`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
              <p className="mt-1 text-gray-800 dark:text-gray-400">
                {el.description}
              </p>
              <a
                className="mt-3 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                href="#"
              >
                View
              </a>
            </div>
          </div>
        </Fragment>
      );
    });
  };

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <p className="text-white font-bold text-xl">Gigs</p>

      <PaginatedItems itemsPerPage={limit} />
    </div>
  );
}
