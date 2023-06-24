import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-4  bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600 via-slate-900 to-slate-900">
      <div>
        <h1 className="pb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-300 text-6xl md:text-7xl font-bold break-words">
          Freelancing
        </h1>
        <h1 className="text-5xl md:text-7xl font-bold text-white break-words">
          made easy.
        </h1>
        <p className="mt-10 text-lg text-gray-400">
          Freelancerth are tailored to your software development needs. With our
          website, hiring and becoming a freelancer never becomes easier. Say
          goodbye to the hassle of freelancing and hello to a world of
          possibilities.
        </p>
        <button
          type="button"
          className="w-full sm:w-fit mt-16 py-3 px-8 bg-gradient-to-r from-blue-600 to-cyan-300 hover:from-cyan-300 hover:to-blue-600 rounded-3xl text-white font-bold transition-colors"
        >
          Start Hiring
        </button>

        <div className="w-full sm:w-fit sm:mt-0 mt-4 sm:ml-8 ml-0 p-0.5 bg-gradient-to-r rounded-3xl from-blue-600 to-cyan-300 hover:from-cyan-300 hover:to-blue-600 inline-flex">
          <button className="py-3 px-8 text-white bg-slate-900 w-full rounded-3xl font-bold">
            Become a freelancer
          </button>
        </div>
        <div className="mt-28 flex sm:space-x-16 space-x-8">
          <div>
            <h1 className="text-white text-4xl font-semibold">90+ %</h1>
            <p className="text-gray-400 mt-2">Job Successful</p>
          </div>
          <div className="">
            <h1 className="text-white text-4xl font-semibold">2.3 K</h1>
            <p className="text-gray-400 mt-2">Satisfied Users</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center lg:order-2 order-first lg:mb-0 mb-10">
        <Image
          src={"/images/hero.png"}
          alt="pic"
          height={500}
          width={500}
          className="w-3/4"
        />
      </div>
    </div>
  );
}
