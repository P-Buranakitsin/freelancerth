"use client";

import { useUploadThing } from "@/utils/uploadthing";
import { useSession } from "next-auth/react";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import { BiXCircle } from "react-icons/bi";
import { BsPersonCircle } from "react-icons/bs";
import { IoCheckmarkCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import { FileError, FileWithPath, useDropzone } from "react-dropzone";
import { endpoints } from "@/constants/endpoints";
import { ImUpload3 } from "react-icons/im";

interface IFreelancerImageSection {
  freelancerProfile: IResponsGETFreelancerProfileByUserId;
}

export default function FreelancerImageSection(props: IFreelancerImageSection) {
  const { data: session, update } = useSession();

  const { startUpload, isUploading } = useUploadThing({
    endpoint: "imageOrFileUploader",
    onClientUploadComplete: () => {
      toast.success("uploaded successfully", {
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
    onUploadError: (e) => {
      throw new Error(e.message);
    },
  });

  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    onDropAccepted: async (acceptedFiles: FileWithPath[]) => {
      console.log(acceptedFiles);
      try {
        let uploadedFiles:
          | {
              fileUrl: string;
              fileKey: string;
            }[]
          | undefined = undefined;
        uploadedFiles = await startUpload(acceptedFiles);
        await updateUser({
          ...(uploadedFiles &&
            uploadedFiles.length > 0 && {
              fileUrl: uploadedFiles[0].fileUrl,
              fileKey: uploadedFiles[0].fileKey,
            }),
        });
      } catch (error: any) {
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
      }
    },
    onDropRejected(fileRejections) {
      console.log("rejected ");
      console.log(fileRejections);
    },
  });

  const updateUser = async ({
    fileUrl,
    fileKey,
  }: {
    fileUrl?: string;
    fileKey?: string;
  }) => {
    const res = await fetch(endpoints.API.userById(session?.user.sub || ""), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(session?.user.email && { email: session.user.email }),
        ...(fileUrl && { fileUrl }),
        ...(fileKey && { fileKey }),
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to update user");
    } else {
      update({
        fileUrl,
        fileKey,
      });
    }
  };

  const fileRejectionItems = fileRejections.map(
    ({ errors }: { file: FileWithPath; errors: FileError[] }) =>
      errors.map((e) => (
        <p key={e.code} className="text-xs text-red-600 mt-2">
          {e.message}
        </p>
      ))
  );

  return (
    <div className="flex flex-row p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 space-x-3 sm:space-x-8 items-center">
      <div className="min-w-fit">
        {session?.user.image ? (
          <Image
            className="inline-block h-20 w-20 rounded-full object-cover"
            src={session.user.image || ""}
            width={200}
            alt="pic"
            height={200}
          />
        ) : (
          <BsPersonCircle
            className="inline-block h-24 w-24 rounded-full"
            color="white"
          />
        )}
      </div>
      <div className="flex overflow-hidden flex-col">
        <p className="text-white font-bold text-lg truncate ">
          {session?.user.name}
        </p>
        <p className="text-white font-semibold text-md truncate mt-1">
          {session?.user.email}
        </p>
        <div className="flex flex-row mt-4 space-x-3 items-center">
          {props.freelancerProfile.data?.verified ? (
            <>
              <IoCheckmarkCircle color="green" size={20} />
              <p className="text-gray-500 text-sm truncate">Verified</p>
            </>
          ) : (
            <>
              <BiXCircle color="red" size={20} />
              <p className="text-gray-500 text-sm truncate">Not Verified</p>
            </>
          )}
        </div>
        <div {...getRootProps({ className: "dropzone mt-4 p-1" })}>
          <input {...getInputProps()} />
          <button
            disabled={isUploading}
            type="button"
            className="w-fit py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          >
            {isUploading ? (
              <>
                <span
                  className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
                  role="status"
                  aria-label="loading"
                ></span>
                Loading
              </>
            ) : (
              <>
                <ImUpload3 size={18} />
                Change Picture
              </>
            )}
          </button>
        </div>
        {fileRejectionItems}
      </div>
    </div>
  );
}
