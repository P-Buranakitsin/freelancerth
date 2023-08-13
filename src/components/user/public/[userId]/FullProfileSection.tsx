"use client";

import Image from "next/image";
import { BsPersonCircle } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";

interface IFullProfileSectionProps {
  dynamicRoute: {
    userId: string;
  };
  userData: IResponseDataGETUserById | undefined;
}

export default function FullProfileSection(props: IFullProfileSectionProps) {
  const { userId } = props.dynamicRoute;

  return (
    <div className="flex flex-col bg-gray-800 border rounded-xl border-gray-700 p-4">
      <div className="flex flex-col sm:flex-row sm:space-x-10">
        {props.userData ? (
          <Image
            alt=""
            src={props.userData.image || ""}
            className="object-cover w-[100px] h-[100px] rounded-full"
            width={100}
            height={100}
          />
        ) : (
          <BsPersonCircle
            className="object-cover w-[100px] h-[100px] rounded-full"
            width={100}
            height={100}
            color="white"
          />
        )}
        <div className="mt-4 sm:mt-0">
          {props.userData && (
            <>
              <div className="flex flex-row space-x-4 items-center">
                <p className="text-white font-bold text-2xl break-all">
                  {props.userData.name || ""}&nbsp;&nbsp;
                  <span className=" text-white font-light text-base break-all">
                    @{props.userData.email.split("@")[0] || ""}
                  </span>
                </p>
              </div>
              <p className="text-gray-800 dark:text-gray-400 break-all">
                {props.userData.role || ""}
                {props.userData.FreelancerProfile &&
                  ` - ${props.userData.FreelancerProfile?.type}`}
              </p>
              <div className="flex flex-row mt-2 space-x-4 items-center">
                {props.userData.profile && (
                  <>
                    <HiOutlineLocationMarker color="#9CA3AF" size={22} />
                    <p className="text-gray-800 dark:text-gray-400 break-all">
                      {props.userData.profile?.city || ""}
                      {props.userData.profile?.city ? ", " : ""}
                      {props.userData.profile?.country || ""}
                    </p>
                  </>
                )}
              </div>
            </>
          )}
          <p className="mt-3 text-gray-800 text-xl dark:text-gray-400 break-all">
            {props.userData?.profile?.description || ""}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p className="mt-3 text-gray-800 text-xl font-semibold dark:text-white break-all">
          BIO
        </p>
        <p className="mt-3 text-gray-800 text-lg dark:text-gray-400 break-all">
          {props.userData?.FreelancerProfile?.bio || ""}
        </p>
      </div>
      <div className="mt-4">
        <p className="mt-3 text-gray-800 text-xl font-semibold dark:text-white break-all">
          My Skills
        </p>
        <div className="flex flex-row gap-3 mt-2 mb-4 flex-wrap">
          {props.userData?.FreelancerProfile?.skills.map((tag, index) => {
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
      </div>
    </div>
  );
}
