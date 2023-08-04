import { endpoints } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IGigCardProps {
  currentItems?: IResponseDataGETGigs[];
  userData?: IResponseDataGETUserById;
  showAll?: boolean
}

export default function GigCard(props: IGigCardProps) {
  const { currentItems, userData } = props;
  const { data: session } = useSession();
  const client = useQueryClient();

  const cartMutation = useMutation<any, Error, IRequestPUTCartByUserId>({
    mutationFn: async (data) => {
      const res = await fetch(
        endpoints.API.cartByUserId(session?.user.sub || ""),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gigId: data.gigId,
          }),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ["cart", session?.user.sub || ""],
      });
      toast.success("item added to cart", {
        toastId: "descriptionSection",
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        toastId: "descriptionSection",
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  });

  const addToCartOnClick = (data: IRequestPUTCartByUserId) => {
    cartMutation.mutate(data);
  };

  if (userData && userData.FreelancerProfile?.gigs) {
    return (props.showAll ? userData.FreelancerProfile?.gigs : userData.FreelancerProfile?.gigs.slice(0, 3)).map((el, index) => {
      return (
        <Fragment key={`gig-card-${index}`}>
          <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
            <div className="flex h-[200px] items-center justify-center">
              {el.image && (
                <Image
                  className="w-full h-[inherit] rounded-t-xl "
                  src={el.image}
                  alt=""
                  width={400}
                  height={400}
                />
              )}
            </div>
            <div className="p-4 md:p-5 border-t-2 border-gray-700 bg-slate-900 rounded-br-[inherit] rounded-bl-[inherit] flex-grow">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white break-words">
                {el.title}
              </h3>
              <div className="flex flex-row gap-3 items-center">
                {userData.image && (
                  <Image
                    className=" h-[30px] w-[30px] rounded-full object-cover"
                    src={userData.image}
                    alt=""
                    width={100}
                    height={100}
                  />
                )}
                <p className="text-gray-500 text-ellipsis overflow-hidden">
                  {userData.email.split("@")[0]} -{" "}
                  {userData.FreelancerProfile?.type}
                </p>
              </div>
              <div className="flex flex-row gap-3 mt-2 mb-4 flex-wrap">
                {el.searchTags.map((tag, index) => {
                  return (
                    <span
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-500 text-white"
                      key={`tag-${index}`}
                    >
                      {tag.skillName}
                    </span>
                  );
                })}
              </div>
              <p className="mt-1 text-gray-800 dark:text-gray-400 break-all">
                {el.description}
              </p>
              <div className="flex flex-row justify-between mt-6 items-center flex-wrap">
                <div className="flex flex-row space-x-4">
                  <Link
                    className=" py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                    href={endpoints.PAGE.gigDetails(
                      el.freelancerProfileId,
                      el.id
                    )}
                  >
                    View
                  </Link>
                  <button
                    className="py-[.688rem] px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-blue-500 hover:text-white hover:bg-gray-800 hover:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm dark:border-gray-700 dark:hover:border-gray-800"
                    onClick={() => addToCartOnClick({ gigId: el.id })}
                    type="button"
                  >
                    <MdAddShoppingCart size={24} color="white" />
                  </button>
                </div>

                <p className="mt-1 text-gray-800 dark:text-white text-end">
                  £&nbsp;{Number(el.price).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </Fragment>
      );
    });
  }

  return currentItems?.map((el, index) => {
    return (
      <Fragment key={`gig-card-${index}`}>
        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
          <div className="flex h-[200px] items-center justify-center">
            {el.image && (
              <Image
                className="w-full h-[inherit] rounded-t-xl "
                src={el.image}
                alt=""
                width={400}
                height={400}
              />
            )}
          </div>
          <div className="p-4 md:p-5 border-t-2 border-gray-700 bg-slate-900 rounded-br-[inherit] rounded-bl-[inherit] flex-grow">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white break-words">
              {el.title}
            </h3>
            <div className="flex flex-row gap-3 items-center">
              {el.freelancerProfile.user.image && (
                <Image
                  className=" h-[30px] w-[30px] rounded-full object-cover"
                  src={el.freelancerProfile.user.image}
                  alt=""
                  width={100}
                  height={100}
                />
              )}
              <p className="text-gray-500 text-ellipsis overflow-hidden">
                {el.freelancerProfile.user.email.split("@")[0]} -{" "}
                {el.freelancerProfile.type}
              </p>
            </div>
            <div className="flex flex-row gap-3 mt-2 mb-4 flex-wrap">
              {el.searchTags.map((tag, index) => {
                return (
                  <span
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-500 text-white"
                    key={`tag-${index}`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
            <p className="mt-1 text-gray-800 dark:text-gray-400 break-all">
              {el.description}
            </p>
            <div className="flex flex-row justify-between mt-6 items-center flex-wrap">
              <div className="flex flex-row space-x-4">
                <Link
                  className=" py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  href={endpoints.PAGE.gigDetails(
                    el.freelancerProfileId,
                    el.id
                  )}
                >
                  View
                </Link>
                <button
                  className="py-[.688rem] px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-blue-500 hover:text-white hover:bg-gray-800 hover:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm dark:border-gray-700 dark:hover:border-gray-800"
                  onClick={() => addToCartOnClick({ gigId: el.id })}
                  type="button"
                >
                  <MdAddShoppingCart size={24} color="white" />
                </button>
              </div>

              <p className="mt-1 text-gray-800 dark:text-white text-end">
                £&nbsp;{Number(el.price).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  });
}
