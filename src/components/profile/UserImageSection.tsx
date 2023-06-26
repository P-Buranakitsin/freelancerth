"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { BsPersonCircle } from "react-icons/bs";
import { ImUpload3 } from "react-icons/im";
import { FileError, FileWithPath, useDropzone } from "react-dropzone";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUploadThing } from "@/utils/uploadthing";

export default function UserImageSection() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { startUpload } = useUploadThing({
    endpoint: "imageUploader",
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
      setIsLoading(true);
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
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onDropRejected(fileRejections) {
        console.log('rejected ')
        console.log(fileRejections)
    },
  });

  const updateUser = async ({
    fileUrl,
    fileKey,
  }: {
    fileUrl?: string;
    fileKey?: string;
  }) => {
    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(session?.user.email && {email: session.user.email}),
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
    <div className="flex flex-row p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 col-span-2 space-x-8 items-center">
      <div className="min-w-fit">
        {session?.user.image ? (
          <Image
            className="inline-block h-24 w-24 rounded-full"
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
      <div className="flex overflow-hidden flex-col space-y-4 p-1">
        <p className="text-white font-bold text-lg truncate ">
          {session?.user.email}
        </p>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <button
            type="button"
            className="w-fit py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          >
            {isLoading ? (
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
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </div>
  );
}
