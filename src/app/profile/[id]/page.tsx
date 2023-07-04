import BasicInfoSection from "@/components/profile/BasicInfoSection";
import DescriptionSection from "@/components/profile/DescriptionSection";
import MoreInfoSection from "@/components/profile/MoreInfoSection";
import RoleSection from "@/components/profile/RoleSection";
import UserImageSection from "@/components/profile/UserImageSection";

export default async function Profile({ params }: { params: { id: string } }) {
 
  return (
    <main className="">
      <div className="max-w-[85rem] mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-white font-bold text-3xl mb-6">My Profile</h1>
        <div className="flex flex-col lg:grid lg:grid-rows-1 grid-cols-1 lg:grid-cols-5 grid-flow-col gap-y-8 gap-x-6">
          <div className="lg:col-span-2 space-y-6">
            <UserImageSection />
            <RoleSection />
            <DescriptionSection />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <BasicInfoSection />
            <MoreInfoSection />
          </div>
        </div>
      </div>
    </main>
  );
}
