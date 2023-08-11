import CreateGigSection from "@/components/create-gig/CreateGigSection";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DialogBox from "@/components/DialogBox";
import { endpoints } from "@/constants/endpoints";
import { cookies } from "next/headers";
import { DEV_ACCESS_TOKEN, PROD_ACCESS_TOKEN } from "@/constants/cookies";

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

export default async function Profile() {
  const data = await getServerSession(authOptions);
  const cookieStore = cookies();
  let token
  if (process.env.NODE_ENV === "development") {
    token = cookieStore.get(DEV_ACCESS_TOKEN)?.value;
  } else {
    token = cookieStore.get(PROD_ACCESS_TOKEN)?.value;
  }
  const res = await getFreelancerProfileByUserId(
    token || "",
    data?.user.sub || ""
  );
  if (data?.user.role !== "FREELANCER") {
    return (
      <DialogBox
        title={"Check your role"}
        description={"Your role needs to be freelancer to access this page"}
        linkMessage={"Go back to home page"}
        url="/"
      />
    );
  }
  if (!res.data || !res.data.verified) {
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
  return <CreateGigSection freelancerProfile={res} session={data} />;
}
