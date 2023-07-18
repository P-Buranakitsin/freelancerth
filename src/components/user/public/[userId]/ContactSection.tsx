"use client";
import { IResponseDataGETUserById } from "@/types/api/users";
import Image from "next/image";
import Link from "next/link";
import { BsGithub, BsPersonCircle } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { CgWebsite } from "react-icons/cg";

interface IContactSectionProps {
  dynamicRoute: {
    userId: string;
  };
  userData: IResponseDataGETUserById | undefined;
}

export default function ContactSection(props: IContactSectionProps) {
  const { userId } = props.dynamicRoute;

  return (
    <div className="flex flex-col bg-gray-800 border rounded-xl border-gray-700 p-4 sticky top-[100px]">
      <div className="flex flex-col sm:flex-row sm:space-x-8">
        {props.userData ? (
          <Image
            alt=""
            src={props.userData.image || ""}
            className="object-cover w-[50px] h-[50px] rounded-full"
            width={100}
            height={100}
          />
        ) : (
          <BsPersonCircle
            className="object-cover w-[50px] h-[50px] rounded-full"
            width={100}
            height={100}
            color="white"
          />
        )}
        <div className="mt-4 sm:mt-0">
          {props.userData && (
            <>
              <p className="text-white font-bold text-lg break-all">
                {props.userData.name || ""}
              </p>
              <p className="text-gray-800 dark:text-gray-400 text-sm break-all">
                {props.userData.role || ""}
                {props.userData.FreelancerProfile &&
                  ` - ${props.userData.FreelancerProfile?.type}`}
              </p>
              <div className="flex flex-row mt-2 space-x-4 items-center">
                {props.userData.profile && (
                  <>
                    <HiOutlineLocationMarker color="#9CA3AF" size={18} />
                    <p className="text-gray-800 dark:text-gray-400 text-sm break-all">
                      {props.userData.profile?.city || ""},&nbsp;
                      {props.userData.profile?.country || ""}
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-row mt-8 space-x-6 items-center justify-center">
        {props.userData?.FreelancerProfile?.linkedInURL && (
          <Link
            href={props.userData.FreelancerProfile.linkedInURL}
            rel="noopener noreferrer"
            target="_blank"
            className="cursor-pointer"
          >
            <FaLinkedin color="#0072b1" size={30} />
          </Link>
        )}
        {props.userData?.FreelancerProfile?.githubURL && (
          <Link
            href={props.userData.FreelancerProfile.githubURL}
            rel="noopener noreferrer"
            target="_blank"
            className="cursor-pointer"
          >
            <BsGithub color="white" size={30} />
          </Link>
        )}
        {props.userData?.FreelancerProfile?.portfolioURL && (
          <Link
            href={props.userData.FreelancerProfile.portfolioURL}
            rel="noopener noreferrer"
            target="_blank"
            className="cursor-pointer"
          >
            <CgWebsite color="gray" size={30} />
          </Link>
        )}
      </div>
      <div className="mt-8">
        <button
          type="button"
          className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
        >
          Send Friend Request
        </button>
        <button
          type="button"
          className="mt-2 w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm dark:text-white dark:hover:bg-gray-900 dark:hover:border-gray-900 dark:focus:ring-gray-900 dark:focus:ring-offset-gray-800"
        >
          Contact Me
        </button>
      </div>
    </div>
  );
}
