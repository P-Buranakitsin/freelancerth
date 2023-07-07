import Link from "next/link";

interface RoleVerificationProps {
  title: String;
  description: String;
  linkMessage: string;
}

export default function RoleVerification(props: RoleVerificationProps) {
  const { title, description, linkMessage } = props;
  return (
    <main className="flex-grow items-center justify-center flex">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              {title}
            </h1>
            <p className="mt-2 text-base dark:text-white">{description}</p>
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              <Link
                className="text-blue-600 decoration-2 hover:underline font-medium"
                href="/"
              >
                {linkMessage}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
