export default function Accordion() {
  // Code from https://preline.co/docs/accordion.html
  // Jokes from https://www.goodhousekeeping.com/life/entertainment/a41779929/corny-jokes/
  return (
    <div className="hs-accordion-group">
      <div
        className="hs-accordion active bg-white border -mt-px first:rounded-t-lg last:rounded-b-lg dark:bg-slate-900 dark:border-gray-700"
        id="hs-bordered-heading-one"
      >
        <button
          className="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex items-center gap-x-3 w-full font-semibold text-left text-gray-800 transition py-4 px-5 hover:text-gray-500 dark:hs-accordion-active:text-blue-500 dark:text-gray-200 dark:hover:text-gray-400"
          aria-controls="hs-basic-bordered-collapse-one"
        >
          <svg
            className="hs-accordion-active:hidden hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 block w-3 h-3 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 8.85999L14.5 8.85998"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <path
              d="M8 15.36L8 2.35999"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="hs-accordion-active:block hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 hidden w-3 h-3 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 8.85999L14.5 8.85998"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
          What do you call an angry carrot?
        </button>
        <div
          id="hs-basic-bordered-collapse-one"
          className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
          aria-labelledby="hs-bordered-heading-one"
        >
          <div className="pb-4 px-5">
            <p className="text-gray-800 dark:text-gray-200">
              A steamed veggie.
            </p>
          </div>
        </div>
      </div>
      <div
        className="hs-accordion bg-white border -mt-px first:rounded-t-lg last:rounded-b-lg dark:bg-slate-900 dark:border-gray-700"
        id="hs-bordered-heading-two"
      >
        <button
          className="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex items-center gap-x-3 w-full font-semibold text-left text-gray-800 transition py-4 px-5 hover:text-gray-500 dark:hs-accordion-active:text-blue-500 dark:text-gray-200 dark:hover:text-gray-400"
          aria-controls="hs-basic-bordered-collapse-two"
        >
          <svg
            className="hs-accordion-active:hidden hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 block w-3 h-3 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 8.85999L14.5 8.85998"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <path
              d="M8 15.36L8 2.35999"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="hs-accordion-active:block hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 hidden w-3 h-3 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 8.85999L14.5 8.85998"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
          What do you call a pile of cats?
        </button>
        <div
          id="hs-basic-bordered-collapse-two"
          className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
          aria-labelledby="hs-bordered-heading-two"
        >
          <div className="pb-4 px-5">
            <p className="text-gray-800 dark:text-gray-200">A meow-ntain.</p>
          </div>
        </div>
      </div>
      <div
        className="hs-accordion bg-white border -mt-px first:rounded-t-lg last:rounded-b-lg dark:bg-slate-900 dark:border-gray-700"
        id="hs-bordered-heading-three"
      >
        <button
          className="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex items-center gap-x-3 w-full font-semibold text-left text-gray-800 transition py-4 px-5 hover:text-gray-500 dark:hs-accordion-active:text-blue-500 dark:text-gray-200 dark:hover:text-gray-400"
          aria-controls="hs-basic-bordered-collapse-three"
        >
          <svg
            className="hs-accordion-active:hidden hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 block w-3 h-3 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 8.85999L14.5 8.85998"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <path
              d="M8 15.36L8 2.35999"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="hs-accordion-active:block hs-accordion-active:text-blue-600 hs-accordion-active:group-hover:text-blue-600 hidden w-3 h-3 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 8.85999L14.5 8.85998"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
          Why did an old man fall in a well?
        </button>
        <div
          id="hs-basic-bordered-collapse-three"
          className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
          aria-labelledby=" hs-bordered-heading-three"
        >
          <div className="pb-4 px-5">
            <p className="text-gray-800 dark:text-gray-200">
              Because he couldn’t see that well!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
