"use client"

import { useFreelancerProfiles, useGigs, useUsers } from "@/hooks/useQuery";
import { Session } from "next-auth";
import { BiUser } from "react-icons/bi";
import { FaShoppingBasket } from "react-icons/fa";
import { SiFreelancer } from "react-icons/si";

interface IStatSectionProps {
    session: Session
}

export default function StatSection(props: IStatSectionProps) {
    const users = useUsers(props.session)
    const freelancerProfiles = useFreelancerProfiles(props.session, {
        pageIndex: 0,
        pageSize: 10,
        verified: undefined
    })
    const gigs = useGigs({
        freelancerProfileId: undefined,
        freelancerType: undefined,
        limit: 6,
        page: 0,
        session: props.session,
        title: ""
    })

    const StatsData = [{
        title: "TOTAL USERS",
        total: users.data?.data?.totalUser || 0,
        icon: BiUser,
    }, {
        title: "TOTAL FREELANCERS",
        total: freelancerProfiles.data?.pagination?.totalItems || 0,
        icon: SiFreelancer,
    }, {
        title: "TOTAL GIGS",
        total: gigs.data?.pagination.totalItems || 0,
        icon: FaShoppingBasket
    }]

    const Stats = () => StatsData.map((el) => {
        return (
            <>
                <div className="flex flex-row space-x-4 p-6 border border-gray-200 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex p-4 bg-slate-900 w-12 h-12 rounded-md items-center justify-center">
                        <el.icon color="white" size={18} />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <p className="text-gray-500 text-sm">{el.title}</p>
                        <p className="text-white text-md">{el.total}</p>
                    </div>
                </div>
            </>
        )
    })

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           <Stats />
        </div>
    )
}