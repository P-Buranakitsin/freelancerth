"use client";

import { useGig } from "@/hooks/useQuery";

interface IPackageSectionProps {
  dynamicRoute: {
    freelancerProfileId: string;
    gigId: string;
  };
}

export default function PackageSection(props: IPackageSectionProps) {
  const { gigId } = props.dynamicRoute;

  const gig = useGig(gigId);

  if (!gig.data?.data) {
    return (
        <></>
    )
  }

  return (
    <div className="flex flex-col bg-gray-800 border rounded-xl border-gray-700">
      <nav
        className="relative z-0 flex border rounded-xl overflow-hidden dark:border-gray-700"
        aria-label="Tabs"
        role="tablist"
      >
        <button
          type="button"
          className="hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-white first:border-l-0 border-l border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-400 active"
          id="bar-with-underline-item-1"
          data-hs-tab="#bar-with-underline-1"
          aria-controls="bar-with-underline-1"
          role="tab"
        >
          Basic
        </button>
        <button
          type="button"
          className="hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-white first:border-l-0 border-l border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-400 dark:hover:text-gray-300"
          id="bar-with-underline-item-2"
          data-hs-tab="#bar-with-underline-2"
          aria-controls="bar-with-underline-2"
          role="tab"
        >
          Intermediate
        </button>
        <button
          type="button"
          className="hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-white first:border-l-0 border-l border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-400 dark:hover:text-gray-300"
          id="bar-with-underline-item-3"
          data-hs-tab="#bar-with-underline-3"
          aria-controls="bar-with-underline-3"
          role="tab"
        >
          Advanced
        </button>
      </nav>
      <div className="m-6">
        <div
          id="bar-with-underline-1"
          role="tabpanel"
          aria-labelledby="bar-with-underline-item-1"
        >
          <div className="flex flex-row justify-between">
            <p className="text-gray-500 dark:text-gray-400">Basic Package</p>
            <p className="text-gray-500 dark:text-gray-400">
              £&nbsp;{Number(gig.data?.data.price).toFixed(2)}
            </p>
          </div>
        </div>
        <div
          id="bar-with-underline-2"
          className="hidden"
          role="tabpanel"
          aria-labelledby="bar-with-underline-item-2"
        >
          <p className="text-gray-500 dark:text-gray-400">Coming Soon</p>
        </div>
        <div
          id="bar-with-underline-3"
          className="hidden"
          role="tabpanel"
          aria-labelledby="bar-with-underline-item-3"
        >
          <p className="text-gray-500 dark:text-gray-400">Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
