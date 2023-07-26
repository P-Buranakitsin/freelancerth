import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DialogBox from "@/components/DialogBox";
import { getServerSession } from "next-auth";

export default async function CustomerOrder({
  params,
}: {
  params: { freelancerId: string };
}) {
  const data = await getServerSession(authOptions);
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
  return (
    <main className="">
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="flex flex-col">
          <h1 className="text-white font-bold text-3xl mb-6">Customer Order</h1>
        </div>
      </div>
    </main>
  );
}
