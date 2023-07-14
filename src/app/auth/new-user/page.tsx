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
import LoadingSpinner from "@/components/LoadingSpinner";
import { NewUser, NewUserSchema } from "@/models/NewUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiErrorCircle } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";
import { UserRole } from "@prisma/client";
import { toast } from "react-toastify";
import { endpoints } from "@/constants/endpoints";

export interface UpdatedUserSession {
  name?: string;
  fileUrl?: string;
  fileKey?: string;
  email?: string;
  role?: UserRole;
}

interface FileWithPreview extends FileWithPath {
  preview?: string;
}

export default function VerifyRequest() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewUser>({
    resolver: zodResolver(NewUserSchema),
  });
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
    router.replace("/");
  };

  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    onDropAccepted: (acceptedFiles) => {
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

  const { startUpload } = useUploadThing({
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

  const onSubmit = handleSubmit(async (data) => {
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
          uploadedFiles.length > 0 && {
            fileUrl: uploadedFiles[0].fileUrl,
            fileKey: uploadedFiles[0].fileKey,
          }),
      });
      router.replace("/");
    } catch (error: any) {
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
    } finally {
      setIsLoading(false);
    }
  });

  const updateUser = async (
    data: NewUser & {
      fileUrl?: string;
      fileKey?: string;
    }
  ) => {
    const updatedName = data.firstName + " " + data.lastName;
    const res = await fetch(endpoints.API.userById(session?.user.sub || ''), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: updatedName,
        ...(session?.user.email && {email: session.user.email}),
        ...(data.fileUrl && { fileUrl: data.fileUrl }),
        ...(data.fileKey && { fileKey: data.fileKey }),
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
        ...(data.fileKey && { fileKey: data.fileKey }),
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
                      {...register("firstName")}
                      className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                    />
                    {errors.firstName?.message && (
                      <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                        <BiErrorCircle className="text-red-500" size={24} />
                      </div>
                    )}
                  </div>
                  {errors.firstName?.message && (
                    <p className="text-xs text-red-600 mt-2">
                      {errors.firstName.message}
                    </p>
                  )}
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
                      {...register("lastName")}
                      className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                    />
                    {errors.lastName?.message && (
                      <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                        <BiErrorCircle className="text-red-500" size={24} />
                      </div>
                    )}
                  </div>
                  {errors.lastName?.message && (
                    <p className="text-xs text-red-600 mt-2">
                      {errors.lastName.message}
                    </p>
                  )}
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
                        isLoading ? "hidden" : "hidden"
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
      {isLoading && <LoadingSpinner />}
      
    </main>
  );
}
