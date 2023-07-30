import CartItemSection from "@/components/cart/gigs/[userId]/CartItemSection";
import OrderSummarySection from "@/components/cart/gigs/[userId]/OrderSummarySection";

export default function CartGigs({ params }: { params: { userId: string } }) {
  
  return (
    <main className="">
      <div className="max-w-[85rem] mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-white font-bold text-2xl sm:text-3xl mb-6">Gig Cart</h1>
        <div className="flex flex-col lg:grid lg:grid-rows-1 grid-cols-1 lg:grid-cols-8 grid-flow-col gap-y-8 gap-x-6">
          <div className="lg:col-span-5">
            <CartItemSection dynamicRoute={params} />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <OrderSummarySection dynamicRoute={params} />
          </div>
        </div>
      </div>
    </main>
  );
}
