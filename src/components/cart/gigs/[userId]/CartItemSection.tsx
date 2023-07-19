import Image from "next/image";
import { HiXMark } from "react-icons/hi2";

interface ICartItemSectionProps {}

export default function CartItemSection(props: ICartItemSectionProps) {
  const CartItem = () => {
    return (
      <div className="p-4 flex flex-row w-full sm:space-x-6 border-t-[1px] border-b-[1px] border-gray-500">
        <Image
          src={
            "https://utfs.io/f/0382eae3-e9b4-481b-988b-276852411dc4_31343C.svg"
          }
          alt=""
          className="rounded hidden sm:block sm:w-[150px] sm:h-[100px] md:w-[300px] md:h-[200px] object-cover"
          width={500}
          height={500}
        />
        <div className="w-full">
          <div className="flex flex-row justify-between w-full h-fit">
            <p className="text-white font-bold text-xl sm:text-2xl break-all">
              Gig title
            </p>
            <div className="flex justify-start items-start p-2 transition ease-in-out delay-50 hover:bg-red-400 bg-red-500 cursor-pointer rounded-md">
              <HiXMark color="white" size={22} />
            </div>
          </div>
          <p className="mt-6 text-gray-500 font-normal text-base sm:text-lg break-all">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam,
          </p>
          <div className="mt-6 flex flex-row justify-between items-center w-full h-fit">
            <button
              type="button"
              className=" w-fit py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
            >
              View
            </button>
            <p className=" text-white font-normal text-lg sm:text-xl break-all">
              £ 10.00
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <CartItem />
      <CartItem />
      <CartItem />
      <CartItem />
    </>
  );
}
