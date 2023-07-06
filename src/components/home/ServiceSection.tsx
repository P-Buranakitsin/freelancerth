import { SiJavascript, SiAzuredevops } from "react-icons/si";
import { FaPenNib } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { BiTestTube } from "react-icons/bi";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { IoBarChartOutline } from "react-icons/io5";
interface ServiceProps {
  title: string;
  description: string;
  Icon: IconType;
}

const Service = (props: ServiceProps) => {
  const { title, description, Icon } = props;
  return (
    <div className="flex flex-col bg-white border rounded-xl dark:bg-slate-900 dark:border-gray-700 hover:shadow hover:shadow-blue-400 cursor-pointer ">
      <div className="flex h-[200px] items-center justify-center">
        <svg width="0" height="0">
          <linearGradient
            id="blue-gradient"
            x1="100%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop stopColor="#67e8f9" offset="0%" />
            <stop stopColor="#2563be" offset="100%" />
          </linearGradient>
        </svg>
        <Icon
          style={{ fill: "url(#blue-gradient)", stroke: "url(#blue-gradient)" }}
          className="w-1/2 h-1/2"
        />
      </div>
      <div className="p-4 md:p-5 border-t-2 border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-gray-800 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default function ServiceSection() {
  const services: ServiceProps[] = [
    {
      title: "Developers",
      Icon: SiJavascript,
      description:
        "Front-End Developers, Back-End Developers, Full-Stack Developers, Game Developers, you name it, we have it!",
    },
    {
      title: "Designers",
      Icon: FaPenNib,
      description:
        "Whether you look for UX/UI, logo designers or animators, all are available here.",
    },
    {
      title: "Testers",
      Icon: BiTestTube,
      description:
        "Never worry about bugs on production again.",
    },
    {
      title: "Project Managers",
      Icon: AiOutlineFundProjectionScreen,
      description:
        "Need someone to manage your project? Click here to work with our experienced project managers.",
    },
    {
      title: "DevOps Engineers",
      Icon: SiAzuredevops,
      description:
        "Our DevOps engineers can help your IT's infrastructure run smooth.",
    },
    {
      title: "Business Analysts",
      Icon: IoBarChartOutline,
      description:
        "Our business analysts are here to help identifying your requirements",
    },
  ];
  return (
    <div className="mt-20">
      <div className="flex flex-col items-center">
        <h1 className="text-white font-semibold text-4xl text-center">
          Choose from our services
        </h1>
        <p className="text-gray-400 mt-5 md:w-2/3 text-center">
          Freelancerth offers a wide range of services needed for software
          development, from developers to project managers. Work with
          professionals and get your work done in no time.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {services.map((service, index) => {
          return <Service key={`service-${index}`} {...service} />;
        })}
      </div>
    </div>
  );
}
