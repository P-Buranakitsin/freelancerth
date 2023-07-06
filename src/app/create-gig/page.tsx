import CreateGigSection from "@/components/create-gig/CreateGigSection";

export default async function Profile() {
  return (
    <main className="">
      <div className="max-w-[85rem] mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-white font-bold text-3xl mb-6">Gig Creation</h1>
        <div className="flex flex-col">
          <CreateGigSection />
        </div>
      </div>
    </main>
  );
}
