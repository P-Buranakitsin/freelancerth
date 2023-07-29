"use client";

import { EditGig, EditGigSchema } from "@/models/EditGig";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Dropzone, { FileRejection, FileWithPath } from "react-dropzone";
import React from "react";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/constants/endpoints";
import { Session } from "next-auth";

interface IEditGigModal {
  gig?: IResponseDataGETGigs;
  fetchDataOptions: {
    page: number;
    limit: number;
    freelancerProfileId: string;
    freelancerType: undefined;
    session: Session | null;
    title: string;
    price: undefined;
  };
}

export default function EditGigModal(props: IEditGigModal) {
  const { startUpload } = useUploadThing({
    endpoint: "imageOrFileUploader",
  });

  const client = useQueryClient();

  const uploadImageMutation = useMutation<
    {
      fileUrl: string;
      fileKey: string;
    }[],
    Error,
    {
      acceptedFiles: FileWithPath[];
    }
  >({
    mutationFn: async (data) => {
      const uploadedFile = await startUpload(data.acceptedFiles);
      if (!uploadedFile) {
        throw new Error("upload failed");
      }
      return uploadedFile;
    },
    onSuccess: () => {
      toast.success("upload completed", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        toastId: "userImageSection",
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  });

  const patchGigByGigIdMutation = useMutation<
    any,
    Error,
    IRequestPutGigByGigId
  >({
    mutationFn: async (body) => {
      const res = await fetch(endpoints.API.gigByGigId(body.gigId), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: async () => {
      (window as any).HSOverlay.close(
        document.querySelector("#hs-vertically-centered-scrollable-modal")
      );
      const { session, ...rest } = props.fetchDataOptions;
      await client.invalidateQueries({
        queryKey: ["gigs", rest],
      });
      toast.success("gig updated", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        toastId: "newUser",
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  });

  const isLoading =
    uploadImageMutation.isLoading || patchGigByGigIdMutation.isLoading;

  const LoadingSpinner = () => {
    if (isLoading) {
      return (
        <span
          className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
          role="status"
          aria-label="loading"
        ></span>
      );
    }
    return <></>;
  };

  const EditGigForm = () => {
    const defaultValues: EditGig = {
      gigTitle: props.gig?.title || "",
      gigDescription: props.gig?.description || "",
      gigPrice: Number(props.gig?.price) || NaN,
      searchTags: props.gig?.searchTags || [],
    };

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<EditGig>({
      resolver: zodResolver(EditGigSchema),
      defaultValues,
    });

    const onSubmit = handleSubmit(async (data) => {
      patchGigByGigIdMutation.mutate({
        gigId: props.gig?.id || "",
        description: data.gigDescription,
        price: data.gigPrice,
        searchTags: data.searchTags,
        title: data.gigTitle,
      })
    });

    const [gigImageError, setGigImageError] = React.useState<string>("");

    const SkillCheckBoxes = () => {
      if (!props.gig?.freelancerProfile.skills) {
        return <></>;
      }
      return props.gig.freelancerProfile.skills.map((skill, index) => {
        return (
          <div key={index}>
            <label className="cursor-pointer flex p-3 w-fit bg-white border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
              <input
                type="checkbox"
                {...register("searchTags")}
                className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                value={skill}
              />
              <span className="text-sm text-gray-500 ml-3 dark:text-gray-400">
                {skill}
              </span>
            </label>
          </div>
        );
      });
    };

    window.addEventListener("close.hs.overlay", ($overlayEl) => {
      reset(defaultValues);
      setGigImageError("");
    });

    return (
      <form onSubmit={onSubmit} className="overflow-y-auto">
        <div className="p-4 ">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-2 dark:text-gray-400">
                Gig Title
              </label>
              <input
                {...register("gigTitle", { disabled: false })}
                type="text"
                className=" disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
                placeholder="Write your title here"
              />
              {errors.gigTitle?.message && (
                <p className="text-xs font-semibold text-red-600 mt-2">
                  {errors.gigTitle.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="mb-2 block text-sm font-medium dark:text-gray-400">
                Gig Description
              </label>
              <textarea
                {...register("gigDescription", { disabled: false })}
                className={`disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white`}
                rows={4}
                placeholder="Write your description here"
              />
              {errors.gigDescription?.message && (
                <p className="text-xs font-semibold text-red-600 mt-2">
                  {errors.gigDescription.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="mb-2 block text-sm font-medium dark:text-gray-400">
                Search Tags
              </label>
              <div className="dark:bg-slate-900 dark:border-gray-700 dark:text-white border-[1px] p-6 rounded-md gap-5 flex flex-wrap">
                <SkillCheckBoxes />
              </div>
              {errors.searchTags?.message && (
                <p className="text-xs font-semibold text-red-600 mt-2">
                  {errors.searchTags.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="mb-2 block text-sm font-medium dark:text-gray-400">
                Gig Price
              </label>
              <div className="flex rounded-md shadow-sm">
                <div className="px-4 inline-flex items-center min-w-fit rounded-l-md border border-r-0 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    GBP
                  </span>
                </div>
                <input
                  {...register("gigPrice", {
                    valueAsNumber: true,
                  })}
                  className="py-3 px-4 pr-11 block w-full border-gray-200 shadow-sm rounded-r-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                />
              </div>
              {errors.gigPrice?.message && (
                <p className="text-xs font-semibold text-red-600 mt-2">
                  {errors.gigPrice.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="mb-2 block text-sm font-medium dark:text-gray-400">
                Gig Photo
              </label>
              <div className="flex flex-wrap gap-5 my-4">
                <div className="w-[300px] h-[300px] box-border inline-flex">
                  <div className="flex overflow-hidden">
                    <Image
                      src={props.gig?.image || ""}
                      alt=""
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              </div>
              <Dropzone
                noClick
                accept={{ "image/*": [] }}
                maxFiles={1}
                onDropAccepted={async (acceptedFiles: FileWithPath[]) => {
                  const uploadedImage = await uploadImageMutation.mutateAsync({
                    acceptedFiles,
                  });
                  patchGigByGigIdMutation.mutate({
                    gigId: props.gig?.id || "",
                    image: uploadedImage[0].fileUrl,
                  });
                }}
                onDropRejected={(fileRejections: FileRejection[]) => {
                  setGigImageError(fileRejections[0].errors[0].message);
                }}
              >
                {({ getRootProps, getInputProps, open }) => (
                  <div>
                    <div
                      className="cursor-pointer dark:bg-slate-900 dark:border-gray-700 border-dashed border-2 p-10 rounded-md gap-5 flex flex-wrap justify-center items-center"
                      {...getRootProps()}
                      onClick={open}
                    >
                      <input
                        {...getInputProps({
                          id: "spreadsheet",
                        })}
                      />

                      <p className="dark:text-gray-400">
                        Drag and drop some files here, or click to select files
                      </p>
                    </div>
                  </div>
                )}
              </Dropzone>
              {gigImageError !== "" && (
                <p className="text-xs font-semibold text-red-600 mt-2">
                  {gigImageError}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
          <button
            type="button"
            className="hs-dropdown-toggle py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
            data-hs-overlay="#hs-vertically-centered-scrollable-modal"
            disabled={isLoading}
          >
            Close
          </button>
          <button
            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
            type="submit"
            disabled={isLoading}
          >
            <LoadingSpinner />
            Save changes
          </button>
        </div>
      </form>
    );
  };

  return (
    <div
      id="hs-vertically-centered-scrollable-modal"
      className="[--overlay-backdrop:static] hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto"
    >
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-xl sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
        <div className="w-full max-h-full overflow-hidden flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
          <div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-white">
              Edit Gig
            </h3>
            <button
              type="button"
              className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
              // Prevent user from closing modal while uploading in progress
              data-hs-overlay={`#hs-vertically-centered-scrollable-modal ${
                isLoading ? "loading" : ""
              }`}
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-3.5 h-3.5"
                width={8}
                height={8}
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <EditGigForm />
        </div>
      </div>
    </div>
  );
}
