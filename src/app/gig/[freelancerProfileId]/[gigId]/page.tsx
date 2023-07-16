import UnauthorisedAccess from "@/components/UnauthorisedAccess";
import GigDetailSection from "@/components/gig/[freelancerProfileId]/[gidId]/GigDetailSection";
import PackageSection from "@/components/gig/[freelancerProfileId]/[gidId]/PackageSection";
import RelatedGigSection from "@/components/gig/[freelancerProfileId]/[gidId]/RelatedGigSection";
import { endpoints } from "@/constants/endpoints";
import { cookies } from "next/headers";

async function getGigByGigId(token: string, gigId: string) {
  const response = await fetch(
    `${process.env.BASE_URL}/${endpoints.API.gigByGigId(gigId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = (await response.json()) as IResponseGETGig;
  return data;
}

async function getRelatedGigs(token: string, myGig: IResponseDataGETGigs) {
  const { searchTags, id } = myGig;
  const { type } = myGig.freelancerProfile;
  const response = await fetch(
    `${process.env.BASE_URL}/${endpoints.API.gigs({
      limit: 3,
      page: 0,
      skills: searchTags,
      freelancerType: type,
    })}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = (await response.json()) as IResponseGETGigs;
  const filteredData = data.data.filter((el) => el.id !== id);
  return filteredData;
}

export default async function GigDetails({
  params,
}: {
  params: { freelancerProfileId: string; gigId: string };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("next-auth.session-token")?.value;
  const myGig = await getGigByGigId(token || "", params.gigId);
  const relatedGigs = await getRelatedGigs(token || "", myGig.data);
  if (!myGig.data) {
    return (
      <UnauthorisedAccess
        title={"Gig not found"}
        description={"Gig does not exist"}
        linkMessage={"Go to gig browsing page"}
      />
    );
  }

  return (
    <main className="">
      <div className="max-w-[85rem] mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-white font-bold text-3xl mb-6">Gig Details</h1>
        <div className="flex flex-col lg:grid lg:grid-rows-1 grid-cols-1 lg:grid-cols-8 grid-flow-col gap-y-8 gap-x-6">
          <div className="lg:col-span-3 space-y-6">
            <PackageSection dynamicRoute={params} gigData={myGig.data} />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <GigDetailSection dynamicRoute={params} gigData={myGig.data} />
          </div>
        </div>
        {relatedGigs.length > 0 && (
          <>
            <h1 className="text-white font-bold text-3xl mt-12">Related Gigs</h1>
            <RelatedGigSection dynamicRoute={params} relatedGigs={relatedGigs} />
          </>
        )}
      </div>
    </main>
  );
}
