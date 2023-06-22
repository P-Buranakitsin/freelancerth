import { BiSupport } from "react-icons/bi";
import { IconType } from "react-icons/lib";
import { MdPayment } from "react-icons/md";
import { AiOutlineStar } from "react-icons/ai";

interface FeatureProps {
  Icon: IconType;
  title: string;
  description: string;
}

const Feature = (props: FeatureProps) => {
  const { Icon, title, description } = props;
  return (
    <div className="flex space-x-6 lg:mt-0 mt-6">
      <div>
        <div className="p-0.5 bg-gradient-to-r rounded-lg from-blue-600 to-cyan-300 inline-flex">
          <div className="p-3 w-[54px] h-[54px] text-white bg-slate-900 rounded-lg font-bold justify-center flex items-center">
            <Icon color="white" className="h-full w-full" />
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-white font-semibold text-2xl">{title}</h1>
        <p className="text-gray-400 mt-2">{description}</p>
      </div>
    </div>
  );
};

export default function FeatureSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-32">
      <Feature
        Icon={BiSupport}
        title="24/7 Support"
        description="Whether you want to reach out to us at 3 a.m. or 3 p.m. Our support
          team is always here to support you."
      />
      <Feature
        Icon={MdPayment}
        title="Secure Payments"
        description="Never worry about getting scammed again. Our website holds your payment until you are satisfied with our freelancers."
      />
      <Feature
        Icon={AiOutlineStar}
        title="Ratings"
        description="Never make blind selections again. Our detailed feedback and rating system determines all characteristics of freelancers from punctuality to ease of communication."
      />
    </div>
  );
}
