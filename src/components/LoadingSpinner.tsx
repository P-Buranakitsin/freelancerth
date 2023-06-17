export default function LoadingSpinner() {
  return (
    <>
      <div
        id="hs-full-screen-modal"
        className="hs-overlay w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto open"
        tabIndex={-1}
      >
        <div
          className="absolute top-1/2 left-1/2 animate-spin inline-block w-12 h-12 border-[3px] border-current border-t-transparent text-gray-800 rounded-full dark:text-white"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>

      <div
        data-hs-overlay-backdrop-template=""
        className="transition duration fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 hs-overlay-backdrop"
      ></div>
    </>
  );
}
