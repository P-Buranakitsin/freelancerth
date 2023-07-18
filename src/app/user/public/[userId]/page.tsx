import FullProfileSection from "@/components/user/public/[userId]/FullProfileSection";
import { endpoints } from "@/constants/endpoints";
import { IResponseGETUserById } from "@/types/api/users";
import { cookies } from "next/headers";

async function getUserById(token: string, userId: string) {
  const response = await fetch(
    `${process.env.BASE_URL}/${endpoints.API.userById(userId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const res = (await response.json()) as IResponseGETUserById;
  return res;
}

export default async function PublicUserProfile({
  params,
}: {
  params: { userId: string };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("next-auth.session-token")?.value;
  const {data} = await getUserById(token || "", params.userId)
  return (
    <main className="">
      <div className="max-w-[85rem] mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-white font-bold text-3xl mb-6">Profile Details</h1>
        <div className="flex flex-col lg:grid lg:grid-rows-1 grid-cols-1 lg:grid-cols-8 grid-flow-col gap-y-8 gap-x-6">
          <div className="lg:col-span-5 space-y-6">
            <FullProfileSection dynamicRoute={params} userData={data} />
          </div>
          <div className="lg:col-span-3 space-y-6"></div>
        </div>
      </div>
    </main>
  );
}
