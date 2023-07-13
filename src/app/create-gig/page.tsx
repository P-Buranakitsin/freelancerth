import CreateGigSection from "@/components/create-gig/CreateGigSection";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import RoleVerification from "@/components/RoleVerification";

export default async function Profile() {
  const data = await getServerSession(authOptions);
  if (data?.user.role !== "FREELANCER") {
    return (
      <RoleVerification
        title={"Check your role"}
        description={"Your role needs to be freelancer to access this page"}
        linkMessage={"Go back to home page"}
      />
    );
  }
  return <CreateGigSection />;
}
