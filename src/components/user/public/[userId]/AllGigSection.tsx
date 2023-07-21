"use client";

import GigCard from "@/components/GigCard";
import { useState } from "react";

interface IAllGigSectionProps {
  dynamicRoute: {
    userId: string;
  };
  userData: IResponseDataGETUserById | undefined;
}

export default function AllGigSection(props: IAllGigSectionProps) {
  const [showAll, setShowAll] = useState<boolean>(false);

  const showAllOnClick = () => {
    setShowAll(!showAll);
  };

  return (
    <>
      <h1 className="text-white font-bold text-2xl mt-12">See my Gigs</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-6 mt-4">
        {props.userData && <GigCard userData={props.userData} />}
      </div>
      <button
        type="button"
        className="w-fit mt-4 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
        onClick={showAllOnClick}
      >
        {showAll ? 'See less' : `See all Gigs (${props.userData?.FreelancerProfile?.gigs.length || 0})`}
      </button>
    </>
  );
}
