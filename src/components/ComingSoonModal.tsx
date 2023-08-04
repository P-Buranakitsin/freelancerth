
interface IComingSoonModalProps {

}

export default function ComingSoonModal(props: IComingSoonModalProps) {
    return (
        <div
            id="hs-task-created-alert"
            className="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto"
        >
            <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                <div className="relative flex flex-col bg-white shadow-lg rounded-xl dark:bg-gray-800">
                    <div className="absolute top-2 right-2">
                        <button
                            type="button"
                            className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                            data-hs-overlay="#hs-task-created-alert"
                        >
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                    <div className="p-4 sm:p-10 text-center overflow-y-auto">
                        {/* Icon */}
                      
                        {/* End Icon */}
                        <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-200">
                            Coming Soon!
                        </h3>
                        <p className="text-gray-500">
                            This feature is not available right now. Please check again later.
                        </p>
                        <div className="mt-6 flex justify-center gap-x-4">
                            <button
                                type="button"
                                className="py-2.5 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                                data-hs-overlay="#hs-task-created-alert"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}