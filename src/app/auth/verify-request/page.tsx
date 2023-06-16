export default function VerifyRequest() {
  return (
    <main className="w-full max-w-md mx-auto p-2">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Check your email
            </h1>
            <p className="mt-2 text-base dark:text-white">
              A sign in link has been sent to your email address
            </p>
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              {" "}
              <a
                className="text-blue-600 decoration-2 hover:underline font-medium"
                href="/auth/signin"
              >
                Go back to login page
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
