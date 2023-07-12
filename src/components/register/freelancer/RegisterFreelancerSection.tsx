"use client";

import {
  RegisterFreelancer,
  RegisterFreelancerSchema,
} from "@/models/RegisterFreelancer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { BsPersonCircle } from "react-icons/bs";
import Dropzone, { FileError, FileWithPath, useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUploadThing } from "@/utils/uploadthing";
import { endpoints } from "@/constants/endpoints";
import { ImUpload3 } from "react-icons/im";
import { useState, useEffect } from "react";
import Select, { Options } from "react-select";

export const freelancerTypeOptions: Options<FreelancerTypeOptionProps> = [
  { value: "DEVELOPERS", label: "DEVELOPERS", isDisabled: false },
  { value: "DESIGNERS", label: "DESIGNERS", isDisabled: false },
  { value: "TESTERS", label: "TESTERS", isDisabled: false },
  { value: "PROJECT_MANAGERS", label: "PROJECT_MANAGERS", isDisabled: false },
  { value: "DEVOPS_ENGINEERS", label: "DEVOPS_ENGINEERS", isDisabled: false },
  { value: "BUSINESS_ANALYSTS", label: "BUSINESS_ANALYSTS", isDisabled: false },
];

export default function RegisterFreelancerSection() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const RegisterFreelancerForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      control,
      setValue,
      watch,
    } = useForm<RegisterFreelancer>({
      resolver: zodResolver(RegisterFreelancerSchema),
      defaultValues: {
        passportOrIdImage: [],
        profilePic: session?.user.image || "",
      },
    });

    const passportOrIdImage = watch("passportOrIdImage");

    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () =>
        passportOrIdImage.forEach((file) =>
          URL.revokeObjectURL(file.preview || "")
        );
    }, []);

    const onSubmit = handleSubmit(async (data) => {
      console.log(data);
    });

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

    const Thumbs = passportOrIdImage.map((file) => {
      return (
        <div
          className="w-[300px] h-[300px] box-border inline-flex my-4"
          key={file.name}
        >
          <div className="flex overflow-hidden">
            <Image
              src={file.preview}
              // Revoke data uri after image is loaded
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
              alt=""
              width={500}
              height={500}
            />
          </div>
        </div>
      );
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
          if (uploadedFiles) {
            setValue("profilePic", uploadedFiles[0].fileUrl);
          }
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
        } finally {
          setIsLoading(false);
        }
      },
      onDropRejected(fileRejections) {
        console.log("rejected ");
        console.log(fileRejections);
      },
    });

    const fileRejectionItems = fileRejections.map(
      ({ errors }: { file: FileWithPath; errors: FileError[] }) =>
        errors.map((e) => (
          <p key={e.code} className="text-xs text-red-600 mt-2">
            {e.message}
          </p>
        ))
    );

    return (
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-white font-bold text-xl mb-4">
              Personal Information
            </p>
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-4 dark:text-gray-400">
                Profile Picture
              </label>
              <div className="flex flex-row gap-4 sm:gap-8 items-center">
                <div className="min-w-fit">
                  {session?.user.image ? (
                    <Image
                      className="inline-block h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover"
                      src={session.user.image || ""}
                      width={200}
                      alt="pic"
                      height={200}
                    />
                  ) : (
                    <BsPersonCircle
                      className="inline-block h-20 w-20 sm:h-24 sm:w-24 rounded-full"
                      color="white"
                    />
                  )}
                </div>
                <div className="flex overflow-hidden flex-col space-y-4 p-1">
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
                          Upload photo
                        </>
                      )}
                    </button>
                  </div>
                  {fileRejectionItems}
                </div>
              </div>
              {errors.profilePic?.message && (
                <p className="text-xs font-semibold text-red-600 mt-2">
                  {errors.profilePic.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div className="mt-4 flex flex-col">
              <label className="block text-sm font-medium mb-2 dark:text-gray-400">
                First Name
              </label>
              <input
                {...register("firstName", { disabled: false })}
                type="text"
                className=" disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
                placeholder="Bonnie"
              />
              {errors.firstName?.message && (
                <p className="text-xs font-semibold text-red-600 mt-2">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="md:mt-4 flex flex-col">
              <label className="block text-sm font-medium mb-2 dark:text-gray-400">
                Last Name
              </label>
              <input
                {...register("lastName", { disabled: false })}
                type="text"
                className="disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
                placeholder="Green"
              />
              {errors.lastName?.message && (
                <p className="text-xs font-semibold text-red-600 mt-2">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">
              BIO
            </label>
            <textarea
              {...register("bio", { disabled: false })}
              className={`disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white`}
              rows={4}
              placeholder="Write your bio here"
            />
            {errors.bio?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.bio.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">
              Passport or ID
            </label>
            <div className="flex flex-wrap gap-5">{Thumbs}</div>
            <Controller
              control={control}
              name="passportOrIdImage"
              render={({ field: { onChange, onBlur } }) => (
                <Dropzone
                  noClick
                  accept={{ "image/*": [] }}
                  onDrop={(acceptedFiles: any[]) => {
                    setValue(
                      "passportOrIdImage",
                      acceptedFiles.map((file) =>
                        Object.assign(file, {
                          preview: URL.createObjectURL(file),
                        })
                      ),
                      {
                        shouldValidate: true,
                      }
                    );
                  }}
                  maxFiles={1}
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
                            onChange,
                            onBlur,
                          })}
                        />

                        <p className="dark:text-gray-400">
                          Drag and drop some files here, or click to select
                          files
                        </p>
                      </div>
                    </div>
                  )}
                </Dropzone>
              )}
            />
            {errors.passportOrIdImage?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.passportOrIdImage.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <p className="text-white font-bold text-xl mb-4">
              Professional Information
            </p>
            <div className="flex flex-col">
              <label className="mb-2 block text-sm font-medium dark:text-gray-400">
                Freelancer Type
              </label>
              <Controller
                control={control}
                render={({ field }) => (
                  <Select
                    className=""
                    styles={{
                      container: (baseStyles) => ({
                        ...baseStyles,
                        height: 46,
                      }),
                      control: (baseStyles) => ({
                        ...baseStyles,
                        height: "100%",
                        backgroundColor: "#0F172A",
                        borderColor: "#374151",
                      }),
                      singleValue: (baseStyles) => ({
                        ...baseStyles,
                        color: "#FFFFFF",
                      }),
                    }}
                    value={freelancerTypeOptions.find(
                      (c) => c.value === field.value
                    )}
                    onChange={(val) => {
                      field.onChange(val?.value);
                    }}
                    options={freelancerTypeOptions}
                    isDisabled={false}
                    isClearable={true}
                  />
                )}
                name="freelancerType"
              />
              {errors.freelancerType?.message && (
                <p className="text-xs font-semibold text-red-600 mt-2">
                  {errors.freelancerType.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          >
            Submit application
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      {session && <RegisterFreelancerForm />}
    </div>
  );
}
