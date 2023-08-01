import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DialogBox from "@/components/DialogBox";
import BioSection from "@/components/freelancer-profile/[freelancerId]/BioSection";
import FinanceSection from "@/components/freelancer-profile/[freelancerId]/FinanceSection";
import FreelancerImageSection from "@/components/freelancer-profile/[freelancerId]/FreelancerImageSection";
import FreelancerSkillSection from "@/components/freelancer-profile/[freelancerId]/FreelancerSkillSection";
import KYCSection from "@/components/freelancer-profile/[freelancerId]/KYCSection";
import LinkSection from "@/components/freelancer-profile/[freelancerId]/LinkSection";
import { endpoints } from "@/constants/endpoints";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

async function getFreelancerProfileByUserId(token: string, userId: string) {
  const response = await fetch(
    `${process.env.BASE_URL}/${endpoints.API.freelancerProfileByUserId(
      userId
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = (await response.json()) as IResponsGETFreelancerProfileByUserId;
  return data;
}

export default async function FreelancerProfile({
  params,
}: {
  params: { freelancerId: string };
}) {
  const session = await getServerSession(authOptions);
  const cookieStore = cookies();
  const token = cookieStore.get("next-auth.session-token")?.value;
  const res = await getFreelancerProfileByUserId(
    token || "",
    session?.user.sub || ""
  );

  if (session?.user.role !== "FREELANCER") {
    return (
      <DialogBox
        title={"Check your role"}
        description={"Your role needs to be freelancer to access this page"}
        linkMessage={"Go back to home page"}
        url="/"
      />
    );
  }
  if (!res.data) {
    return (
      <DialogBox
        title={"Check your freelancer profile"}
        description={
          "You need to create a freelancer profile and be verified first"
        }
        linkMessage={"Go back to home page"}
        url="/"
      />
    );
  }

  return (
    <main className="">
      <div className="max-w-[85rem] mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-white font-bold text-3xl mb-6">
          My Freelancer Profile
        </h1>
        <div className="flex flex-col lg:grid lg:grid-rows-1 grid-cols-1 lg:grid-cols-5 grid-flow-col gap-y-8 gap-x-6">
          <div className="lg:col-span-2 space-y-6">
            <FreelancerImageSection freelancerProfile={res} />
            <BioSection session={session} />
            <FinanceSection session={session} />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <FreelancerSkillSection session={session} />
            <KYCSection session={session} />
            <LinkSection session={session} />
          </div>
        </div>
      </div>
    </main>
  );
}
