"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";
import { useGigs } from "@/hooks/useQuery";
import { endpoints } from "@/constants/endpoints";
import EmptyStateCard from "@/components/EmptyStateCard";
import "react-toastify/dist/ReactToastify.css";
import GigCard from "@/components/GigCard";

export default function GigSection() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 0;
  const limit = Number(searchParams.get("limit")) || 6;
  const title = searchParams.get("title") || "";
  const freelancerType =
    (searchParams.get("freelancerType") as FreelancerType) || undefined;
  const skillsParams = searchParams.getAll("skills") || undefined;
  const gigType = (searchParams.get("gigType") as GigType) || undefined;
  const price = searchParams.get("price") || undefined;

  
  const router = useRouter();

  const gigs = useGigs({
    session,
    page,
    freelancerType,
    limit,
    title,
    skills: skillsParams as SkillName[] | undefined,
    type: gigType,
    price,
    freelancerProfileId: undefined,
  });

  const PaginatedItems = () => {
    const handlePageClick = (event: any) => {
      router.push(
        endpoints.PAGE.gigs({
          page: event.selected,
          limit,
          title,
          freelancerType,
          skills: skillsParams as SkillName[] | undefined,
          price,
        })
      );
    };
    if (!gigs.data?.data || gigs.data.data.length < 1) {
      return <EmptyStateCard />;
    }

    
    return (
      <>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 mt-4">
          <GigCard currentItems={gigs.data?.data || []} />
        </div>
        <div className=" mt-[60px] mb-8">
          <ReactPaginate
            containerClassName="flex flex-row justify-end gap-8 flex-wrap text-gray-500"
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={gigs.data?.pagination?.totalPages || 0}
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

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <p className="text-white font-bold text-xl">Gigs</p>
      <PaginatedItems />
    </div>
  );
}
