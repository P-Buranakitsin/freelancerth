"use client";

import { endpoints } from "@/constants/endpoints";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";

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

  const GigCard = ({
    userData,
  }: {
    userData: IResponseDataGETUserById | undefined;
  }) => {
    return userData?.FreelancerProfile?.gigs
      .slice(0, showAll ? userData.FreelancerProfile.gigs.length : 3)
      .map((el, index) => {
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
                <h3 className="text-lg font-bold text-gray-800 dark:text-white break-words">
                  {el.title}
                </h3>
                <div className="flex flex-row gap-3 items-center">
                  {userData.image && (
                    <Image
                      className=" h-[30px] w-[30px] rounded-full object-cover"
                      src={userData.image}
                      alt=""
                      width={100}
                      height={100}
                    />
                  )}
                  <p className="text-gray-500 text-ellipsis overflow-hidden">
                    {userData.email.split("@")[0]} -{" "}
                    {userData.FreelancerProfile?.type}
                  </p>
                </div>
                <div className="flex flex-row gap-3 mt-2 mb-4 flex-wrap">
                  {el.searchTags.map((tag, index) => {
                    return (
                      <span
                        className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-500 text-white"
                        key={`tag-${index}`}
                      >
                        {tag.skillName}
                      </span>
                    );
                  })}
                </div>
                <p className="mt-1 text-gray-800 dark:text-gray-400">
                  {el.description}
                </p>
                <div className="flex flex-row justify-between mt-6 items-center">
                  <Link
                    className=" py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                    href={endpoints.PAGE.gigDetails(
                      el.freelancerProfileId,
                      el.id
                    )}
                  >
                    View
                  </Link>
                  <p className="mt-1 text-gray-800 dark:text-white text-end">
                    £&nbsp;{Number(el.price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </Fragment>
        );
      });
  };
  return (
    <>
      <h1 className="text-white font-bold text-2xl mt-12">See my Gigs</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-6 mt-4">
        <GigCard userData={props.userData} />
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
