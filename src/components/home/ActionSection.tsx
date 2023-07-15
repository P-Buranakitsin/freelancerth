"use client";

import { endpoints } from "@/constants/endpoints";
import { useRouter } from "next/navigation";

export default function ActionSection() {
  const router = useRouter();
  const startHiringOnClick = () => {
    router.push(endpoints.PAGE.browseGigs(0));
  };
  const becomeFreelancerOnClick = () => {
    router.push(endpoints.PAGE.registerFreelancer());
  };
  return (
    <div className="my-32">
      <div className="relative overflow-hidden">
        <div className="max-w-[85rem] mx-auto">
          <div className="bg-gradient-to-r from-transparent via-blue-600 to-transparent h-px" />
          <div className="absolute top-[150px] left-1/2 -z-[1] w-[1052px] h-[300px] bg-[radial-gradient(closest-side,#2563eb66,#2563eb1a,transparent)] -translate-y-[300px] -translate-x-1/2 dark-bg-radial-gradient"></div>
          <div className="relative pt-12 md:pt-24">
            {/* Title */}
            <div className="flex flex-col items-center sm:space-y-7 space-y-10">
              <h1 className="text-white font-semibold sm:text-4xl text-3xl text-center">
                Ready to get started?
              </h1>
              <div className="flex sm:flex-row justify-center sm:space-x-6 -sm:space-y-4 items-center flex-wrap">
                <button
                  type="button"
                  className="w-full sm:w-fit py-3 px-8 bg-gradient-to-r from-blue-600 to-cyan-300 hover:from-cyan-300 hover:to-blue-600 rounded-3xl text-white font-bold transition-colors"
                  onClick={startHiringOnClick}
                >
                  Start Hiring
                </button>
                <h1 className="text-white font-semibold text-xl text-center">
                  OR
                </h1>
                <div className="w-full sm:w-fit sm:ml-8 ml-0 p-0.5 bg-gradient-to-r rounded-3xl from-blue-600 to-cyan-300 hover:from-cyan-300 hover:to-blue-600 inline-flex">
                  <button
                    className="py-3 px-8 text-white bg-slate-900 w-full rounded-3xl font-bold"
                    onClick={becomeFreelancerOnClick}
                  >
                    Become a freelancer
                  </button>
                </div>
              </div>
            </div>
            {/* End Title */}
          </div>
        </div>
      </div>
    </div>
  );
}
