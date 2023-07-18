import { IResponseDataGETUserById } from "@/types/api/users";
import Image from "next/image";
import { HiOutlineLocationMarker } from "react-icons/hi";

interface IFullProfileSectionProps {
  dynamicRoute: {
    userId: string;
  };
  userData: IResponseDataGETUserById;
}

export default function FullProfileSection(props: IFullProfileSectionProps) {
  const { image, name, email, role, FreelancerProfile, profile } =
    props.userData;
  return (
    <div className="flex flex-col bg-gray-800 border rounded-xl border-gray-700 p-4">
      <div className="flex flex-col sm:flex-row sm:space-x-10">
        <Image
          alt=""
          src={image}
          className="object-fill w-[100px] h-[100px] rounded-full"
          width={200}
          height={200}
        />
        <div className="mt-4 sm:mt-0">
          <div className="flex flex-row space-x-4 items-center">
            <p className="text-white font-bold text-2xl break-all">
              {name}&nbsp;&nbsp;
              <span className=" text-white font-light text-base break-all">
                @{email.split("@")[0]}
              </span>
            </p>
          </div>
          {FreelancerProfile && (
            <p className="text-gray-800 dark:text-gray-400 break-all">
              {role}&nbsp;-&nbsp;{FreelancerProfile.type}
            </p>
          )}

          {profile && (
            <>
              <div className="flex flex-row mt-2 space-x-4 items-center">
                <HiOutlineLocationMarker color="#9CA3AF" size={22} />
                <p className="text-gray-800 dark:text-gray-400 break-all">
                  {profile.city},&nbsp;{profile.country}
                </p>
              </div>
              <p className="mt-3 text-gray-800 text-xl dark:text-gray-400 break-all">
                {profile.description}
              </p>
            </>
          )}
        </div>
      </div>
      <div className="mt-4">
        <p className="mt-3 text-gray-800 text-xl font-semibold dark:text-white break-all">
          BIO
        </p>
        <p className="mt-3 text-gray-800 text-lg dark:text-gray-400 break-all">
          {FreelancerProfile?.bio || ""}
        </p>
      </div>
      <div className="mt-4">
        <p className="mt-3 text-gray-800 text-xl font-semibold dark:text-white break-all">
          My Skills
        </p>
        {FreelancerProfile && (
          <div className="flex flex-row gap-3 mt-2 mb-4 flex-wrap">
            {FreelancerProfile?.skills.map((tag, index) => {
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
        )}
      </div>
    </div>
  );
}
