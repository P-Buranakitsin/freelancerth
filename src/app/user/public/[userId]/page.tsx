"use client";

import DialogBox from "@/components/DialogBox";
import AllGigSection from "@/components/user/public/[userId]/AllGigSection";
import ContactSection from "@/components/user/public/[userId]/ContactSection";
import FullProfileSection from "@/components/user/public/[userId]/FullProfileSection";
import { endpoints } from "@/constants/endpoints";
import { useUser } from "@/hooks/useQuery";

export default function PublicUserProfile({
  params,
}: {
  params: { userId: string };
}) {
  const { data, isLoading } = useUser(params.userId);
  const userData = data?.data;
  if (isLoading) {
    return <></>;
  }
  if (!userData) {
    return (
      <DialogBox
        title={"Profile not found"}
        description={"Profile does not exist"}
        linkMessage={"Go to gig browsing page"}
        url={endpoints.PAGE.browseGigs(0)}
      />
    );
  }
  return (
    <main className="">
      <div className="max-w-[85rem] mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-white font-bold text-3xl mb-6">Profile Details</h1>
        <div className="flex flex-col lg:grid lg:grid-rows-1 grid-cols-1 lg:grid-cols-8 grid-flow-col gap-y-8 gap-x-6">
          <div className="lg:col-span-5 space-y-6">
            <FullProfileSection dynamicRoute={params} userData={userData} />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <ContactSection dynamicRoute={params} userData={userData} />
          </div>
        </div>
        {data?.data?.FreelancerProfile?.gigs &&
          data.data.FreelancerProfile.gigs.length > 0 && (
            <AllGigSection dynamicRoute={params} userData={userData} />
          )}
      </div>
    </main>
  );
}
