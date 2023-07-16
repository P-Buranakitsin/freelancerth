import CreateGigSection from "@/components/create-gig/CreateGigSection";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import UnauthorisedAccess from "@/components/UnauthorisedAccess";
import { endpoints } from "@/constants/endpoints";
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
  const data =
    (await response.json()) as IResponseDataGETFreelancerProfileByUserId;
  return data;
}

export default async function Profile() {
  const data = await getServerSession(authOptions);
  const cookieStore = cookies();
  const token = cookieStore.get("next-auth.session-token")?.value;
  const res = await getFreelancerProfileByUserId(
    token || "",
    data?.user.sub || ""
  );
  if (data?.user.role !== "FREELANCER") {
    return (
      <UnauthorisedAccess
        title={"Check your role"}
        description={"Your role needs to be freelancer to access this page"}
        linkMessage={"Go back to home page"}
      />
    );
  }
  if (!res.data) {
    return (
      <UnauthorisedAccess
        title={"Check your freelancer profile"}
        description={
          "You need to create a freelancer profile and be verified first"
        }
        linkMessage={"Go back to home page"}
      />
    );
  }
  return <CreateGigSection freelancerProfile={res} />;
}
