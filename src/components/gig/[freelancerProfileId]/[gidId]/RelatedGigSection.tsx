"use client";

import { endpoints } from "@/constants/endpoints";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

interface IRelatedGigSectionProps {
  dynamicRoute: {
    freelancerProfileId: string;
    gigId: string;
  };
  relatedGigs: IResponseDataGETGigs[];
}

export default function RelatedGigSection(props: IRelatedGigSectionProps) {
  const { relatedGigs } = props;
  const GigCard = ({
    currentItems,
  }: {
    currentItems: IResponseDataGETGigs[];
  }) => {
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
              <h3 className="text-lg font-bold text-gray-800 dark:text-white break-words">
                {el.title}
              </h3>
              <div className="flex flex-row gap-3 items-center">
                {el.freelancerProfile.user.image && (
                  <Image
                    className=" h-[30px] w-[30px] rounded-full object-cover"
                    src={el.freelancerProfile.user.image}
                    alt=""
                    width={100}
                    height={100}
                  />
                )}
                <p className="text-gray-500 text-ellipsis overflow-hidden">
                  {el.freelancerProfile.user.email.split("@")[0]} -{" "}
                  {el.freelancerProfile.type}
                </p>
              </div>
              <div className="flex flex-row gap-3 mt-2 mb-4 flex-wrap">
                {el.searchTags.map((tag, index) => {
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
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-6">
      <GigCard currentItems={relatedGigs} />
    </div>
  );
}
