import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UnauthorisedAccess from "@/components/UnauthorisedAccess";
import RegisterFreelancerSection from "@/components/register/freelancer/RegisterFreelancerSection";
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
  const data =
    (await response.json()) as IResponsGETFreelancerProfileByUserId;
  return data;
}

export default async function RegisterFreelancer() {
  const data = await getServerSession(authOptions);
  const cookieStore = cookies();
  const token = cookieStore.get("next-auth.session-token")?.value;
  const res = await getFreelancerProfileByUserId(
    token || "",
    data?.user.sub || ""
  );

  if (res.data) {
    return (
      <UnauthorisedAccess
        title={"You already have a freelancer profile"}
        description={
          "If you would like to edit your freelancer profile, please click the link below"
        }
        linkMessage={"Go to my freelancer profile page"}
      />
    );
  }
  return <RegisterFreelancerSection />;
}
