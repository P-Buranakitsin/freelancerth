import { Session } from "next-auth";
import Image from 'next/image'

interface IActiveUserSectionProps {
    session: Session
}

export default function ActiveUserSection(props: IActiveUserSectionProps) {
    return (
        <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="flex flex-col p-6 border border-gray-200 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <p className="text-white text-lg font-semibold mb-8">Active Users</p>
                <div className="relative">
                    <Image
                        src={"/images/activeUser.png"}
                        alt="pic"
                        height={1000}
                        width={1000}
                        className="w-full blur-sm"
                    />
                    <button disabled type="button" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                        Coming Soon
                    </button>
                </div>
            </div>
        </div>
    )
}