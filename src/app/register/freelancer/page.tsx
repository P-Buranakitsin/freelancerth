import { getServerSession } from "next-auth";
import RoleVerification from "@/components/RoleVerification";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RegisterFreelancerSection from "@/components/register/freelancer/RegisterFreelancerSection";

export default async function RegisterFreelancer() {
  const data = await getServerSession(authOptions);

  return (
    <main className="">
      <div className="max-w-[85rem] mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-white font-bold text-3xl mb-6">
          Freelancer Registration
        </h1>
        <div className="flex flex-col">
          <RegisterFreelancerSection />
        </div>
      </div>
    </main>
  );
}
