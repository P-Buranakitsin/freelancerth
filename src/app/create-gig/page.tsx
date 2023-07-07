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
  return (
    <main className="">
      <div className="max-w-[85rem] mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-white font-bold text-3xl mb-6">Gig Creation</h1>
        <div className="flex flex-col">
          <CreateGigSection />
        </div>
      </div>
    </main>
  );
}
