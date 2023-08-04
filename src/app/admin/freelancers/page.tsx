import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DialogBox from "@/components/DialogBox";
import FreelancerTableSection from "@/components/admin/freelancers/FreelancerTableSection";
import { getServerSession } from "next-auth";

export default async function AdminFreelancers() {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "ADMIN") {
        return (
            <DialogBox
                title={"Check your role"}
                description={"Your role needs to be admin to access this page"}
                linkMessage={"Go back to home page"}
                url="/"
            />
        );
    }
    return (
        <main className="lg:pl-64">
            <div className=" mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-white font-bold text-3xl mb-6">Manage Freelancers</h1>
                <FreelancerTableSection session={session} />
            </div>
        </main>
    )
}