"use client";

import Accordion from "@/components/Accordion";
import Image from "next/image";

interface IGigDetailSectinoProps {
  dynamicRoute: {
    freelancerProfileId: string;
    gigId: string;
  };
  gigData: IResponseDataGETGigs;
}

export default function GigDetailSection(props: IGigDetailSectinoProps) {
  const { image, title, searchTags, description, freelancerProfile } =
    props.gigData;
  return (
    <div className="flex flex-col bg-gray-800 border rounded-xl border-gray-700 p-6">
      <Image
        alt=""
        src={image}
        className="object-contain w-full rounded"
        width={500}
        height={500}
      />
      <p className="text-white font-bold text-xl mt-6 break-all">{title}</p>
      <div className="flex flex-row gap-3 mt-2 mb-4 flex-wrap">
        {searchTags.map((tag, index) => {
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
      <p className="mt-3 text-gray-800 dark:text-gray-400">{description}</p>
      <div className="mt-6 flex flex-col space-y-4">
        <p className="text-white font-bold text-lg">Freelancer</p>
        <div className="bg-slate-900 p-4 w-full md:w-[60%] rounded-md flex flex-row space-x-6">
          <Image
            className=" h-[60px] w-[60px] rounded-full object-cover"
            src={freelancerProfile.user.image}
            alt=""
            width={200}
            height={200}
          />
          <div>
            <p className="text-gray-400 font-semibold text-base break-all">
              {freelancerProfile.user.name}&nbsp;-&nbsp;
              {freelancerProfile.type}
            </p>
            <p className="text-gray-500 font-medium text-sm break-all mt-2">
              {freelancerProfile.bio}
            </p>
            <button
              type="button"
              className="mt-7 w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
            >
              View Full Profile
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col space-y-4">
        <p className="text-white font-bold text-lg">FAQ</p>
        <Accordion />
      </div>
    </div>
  );
}
