"use client";

import { useRouter } from "next/navigation";
import { BsPersonCircle } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ImBin, ImUpload3 } from "react-icons/im";
import { useUploadThing } from "@/utils/uploadthing";
import { FileError, FileWithPath, useDropzone } from "react-dropzone";
import Image from "next/image";
import { useForm } from "react-hook-form";

type FormData = {
  firstName: string;
  lastName: string;
};

interface FileWithPreview extends FileWithPath {
  preview?: string;
}

export default function VerifyRequest() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (session?.user) {
      setFiles([{ preview: session.user.image } as FileWithPreview]);
      reset({
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ")[1] || "",
      });
    }
  }, [session?.user]);

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview!));
  }, []);

  const skip = () => {
    router.push("/");
  };

  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    onDropRejected() {
      if (session?.user?.image) {
        setFiles([{ preview: session.user.image } as FileWithPreview]);
      }
    },
  });

  const { startUpload, isUploading } = useUploadThing({
    endpoint: "imageUploader",
    onClientUploadComplete: () => {
      alert("uploaded successfully!");
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
  });

  const removeImage = () => {
    if (session?.user?.image) {
      setFiles([{ preview: session.user.image } as FileWithPreview]);
    } else {
      setFiles([]);
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

  const onSubmit = handleSubmit(async (data: FormData) => {
    setIsLoading(true);
    try {
      let uploadedFiles:
        | {
            fileUrl: string;
            fileKey: string;
          }[]
        | undefined = undefined;
      if (files[0].preview !== session?.user?.image) {
        uploadedFiles = await startUpload(files);
      }
      await updateUser({
        ...data,
        ...(uploadedFiles &&
          uploadedFiles.length > 0 && { fileUrl: uploadedFiles[0].fileUrl }),
      });
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  });

  const updateUser = async (data: FormData & { fileUrl?: string }) => {
    const updatedName = data.firstName + " " + data.lastName;
    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: updatedName,
        ...(data.fileUrl && { fileUrl: data.fileUrl }),
      }),
    });
    // Recommendation: handle errors
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to update user");
    } else {
      // Update the session
      update({
        name: updatedName,
        ...(data.fileUrl && { fileUrl: data.fileUrl }),
      });
    }
  };

  return (
    <main className="w-full max-w-lg mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Welcome
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please fill in your information{" "}
            </p>
            {files.length === 1 && files[0].preview ? (
              <Image
                className="inline-block h-[5rem] w-[5rem] rounded-full ring-2 ring-white dark:ring-gray-800 mt-5"
                src={files[0].preview || ""}
                alt="Profile pic"
                width={200}
                height={200}
                priority
              />
            ) : (
              <BsPersonCircle
                className="inline-block h-[5rem] w-[5rem] rounded-full ring-2 ring-white dark:ring-gray-800 mt-5"
                color="white"
              />
            )}
          </div>

          <div className="mt-5">
            {/* Form */}
            <form onSubmit={onSubmit}>
              <div className="grid gap-y-4">
                <div className="">
                  <div className="block text-sm mb-2 dark:text-white">
                    Profile picture
                  </div>
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-4">
                    <div {...getRootProps({ className: "dropzone" })}>
                      <input {...getInputProps()} />
                      <button
                        type="button"
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                      >
                        <ImUpload3 size={18} />
                        Upload
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                    >
                      <ImBin size={18} />
                      Delete
                    </button>
                  </div>
                  {fileRejectionItems}
                </div>
                <div>
                  <label className="block text-sm mb-2 dark:text-white">
                    First name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("firstName")}
                      className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                      required
                      aria-describedby="first_name-error"
                    />
                    <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                      <svg
                        className="h-5 w-5 text-red-500"
                        width={16}
                        height={16}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>
                  <p
                    className="hidden text-xs text-red-600 mt-2"
                    id="first_name-error"
                  >
                    Please include a valid first name
                  </p>
                </div>
                {/* End Form Group */}
                {/* Form Group */}
                <div>
                  <div className="flex justify-between items-center">
                    <label className="block text-sm mb-2 dark:text-white">
                      Last name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("lastName")}
                      className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                      required
                      aria-describedby="last_name-error"
                    />
                    <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                      <svg
                        className="h-5 w-5 text-red-500"
                        width={16}
                        height={16}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>
                  <p
                    className="hidden text-xs text-red-600 mt-2"
                    id="last_name-error"
                  >
                    Please include a valid last name
                  </p>
                </div>
                {/* End Form Group */}
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-4">
                  <button
                    type="button"
                    onClick={skip}
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  >
                    <span
                      className={`${
                        isLoading ? "" : "hidden"
                      } animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full`}
                      role="status"
                      aria-label="loading"
                    />
                    Submit
                  </button>
                </div>
              </div>
            </form>
            {/* End Form */}
          </div>
        </div>
      </div>
    </main>
  );
}
