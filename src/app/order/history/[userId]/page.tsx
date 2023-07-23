

export default function OrderHistory({ params }: { params: { userId: string } }) {
    return (
        <main className="">
      <div className="max-w-[85rem] mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <h1 className="text-white font-bold text-3xl mb-6">
            Order History
          </h1>
          <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            
          </div>
        </div>
      </div>
    </main>
    )
}