"use client";

import GigCard from "@/components/GigCard";
import React from "react";

interface IRelatedGigSectionProps {
  dynamicRoute: {
    freelancerProfileId: string;
    gigId: string;
  };
  relatedGigs: IResponseDataGETGigs[];
}

export default function RelatedGigSection(props: IRelatedGigSectionProps) {
  const { relatedGigs } = props;
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-6">
      <GigCard currentItems={relatedGigs} />
    </div>
  );
}
