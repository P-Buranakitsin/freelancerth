import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DialogBox from "@/components/DialogBox";
import ActiveUserSection from "@/components/admin/dashboard/ActiveUserSection";
import StatSection from "@/components/admin/dashboard/StatSection";
import { getServerSession } from "next-auth";

export default async function AdminDashboard() {
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
                <h1 className="text-white font-bold text-3xl mb-6">Admin Dashboard</h1>
                <StatSection session={session} />
                <ActiveUserSection session={session} />
            </div>
        </main>

    )
}