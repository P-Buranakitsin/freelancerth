import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import { FaQuoteLeft } from "react-icons/fa";

interface ReviewProps {
  src: string;
  name: string;
  role: string;
  description: string;
}

const Review = (props: ReviewProps) => {
  const { src, name, role, description } = props;
  return (
    <div className="flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5 dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7] dark:text-gray-400">
      <FaQuoteLeft className="fill-blue-600" />
      <p className="text-white font-light text-lg mt-4">{description}</p>
      <div className="mt-16 flex space-x-6 items-center">
        <Image
          width={100}
          height={100}
          className="inline-block h-[80px] w-[80px] rounded-full ring-2 ring-white dark:ring-gray-800"
          src={src}
          alt="Image Description"
        />
        <div className="flex flex-col">
          <h2 className="text-white font-semibold text-lg">{name}</h2>
          <p className="text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default function ReviewSection() {
  const stars = Array.from(Array(5).keys());
  return (
    <div className="mt-20">
      <div className="flex flex-col items-center">
        <h1 className="text-white font-semibold text-4xl text-center">
          Hear from our users
        </h1>
        <div className="flex items-center mt-5 md:w-2/3 justify-center flex-wrap">
          <p className="text-gray-400 text-center">
            Our users say&nbsp;&nbsp;
            <span className="text-gray-400 font-bold text-xl">
              Excellent&nbsp;&nbsp;
            </span>
          </p>
          {stars.map((star, index) => {
            return (
              <AiFillStar size={20} className="fill-yellow-200" key={index} />
            );
          })}
          <p className="text-gray-400 text-center">
            &nbsp;&nbsp; 5 out of 5 based on 123 reviews
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14 w-full">
          <Review
            name="Pavaruth Buranakitsin"
            src="/images/me.jpeg"
            description=" Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Libero
              nunc consequat interdum varius sit amet mattis vulputate. Tellus
              integer feugiat scelerisque varius morbi."
            role="Web Developer"
          />
          <Review
            name="Pavaruth Buranakitsin"
            src="/images/me.jpeg"
            description=" Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Libero
              nunc consequat interdum varius sit amet mattis vulputate. Tellus
              integer feugiat scelerisque varius morbi."
            role="Web Developer"
          />
          <Review
            name="Pavaruth Buranakitsin"
            src="/images/me.jpeg"
            description=" Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Libero
              nunc consequat interdum varius sit amet mattis vulputate. Tellus
              integer feugiat scelerisque varius morbi."
            role="Web Developer"
          />
        </div>
      </div>
    </div>
  );
}
