import FilterBySection from "@/components/browse/gigs/FilterBySection";
import GigSection from "@/components/browse/gigs/GigSection";

export default async function Profile() {
  return (
    <main className="">
      <div className="max-w-[85rem] mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-white font-bold text-3xl mb-6">Gig Browsing</h1>
        <div className="flex flex-col lg:grid lg:grid-rows-1 grid-cols-1 lg:grid-cols-6 grid-flow-col gap-y-8 gap-x-6">
          <div className="lg:col-span-2 space-y-6">
            <FilterBySection />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <GigSection />
          </div>
        </div>
      </div>
    </main>
  );
}
