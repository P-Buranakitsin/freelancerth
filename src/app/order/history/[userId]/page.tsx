import Table from "@/components/table/Table";

export default function OrderHistory({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <main className="">
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="flex flex-col">
          <h1 className="text-white font-bold text-3xl mb-6">Order History</h1>
          <Table />
        </div>
      </div>
    </main>
  );
}
