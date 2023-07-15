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
import Dropzone, { FileWithPath, useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUploadThing } from "@/utils/uploadthing";
import { endpoints } from "@/constants/endpoints";
import { ImUpload3 } from "react-icons/im";
import { useState, useEffect } from "react";
import Select from "react-select";
import {
  freelancerTypeOptions,
  skillOptionsBasedOnType,
} from "@/constants/react-select";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useFreelancerProfile } from "@/hooks/useQuery";
import UnauthorisedAccess from "@/components/UnauthorisedAccess";
import { useRouter } from "next/navigation";

export default function RegisterFreelancerSection() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data } = useFreelancerProfile(session);
  const router = useRouter();

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
        freelancerType: "DEVELOPERS",
        skills: [],
        resumeOrCV: [],
      },
      shouldUnregister: false,
    });

    const passportOrIdImage = watch("passportOrIdImage");
    const freelancerType = watch("freelancerType");
    const resumeOrCV = watch("resumeOrCV");

    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () =>
        passportOrIdImage.forEach((file) =>
          URL.revokeObjectURL(file.preview || "")
        );
    }, []);

    const onSubmit = handleSubmit(async (submittedData) => {
      console.log(data);
      try {
        if (data?.data) {
          throw new Error("freelancer profile already exists");
        }
        // Post to APIs in parallel
        const [uploadedPassportOrId, user, uploadedResumeOrCV] =
          await Promise.all([
            uploadPassportOrIdMutation.mutateAsync(submittedData),
            patchUserByIdMutation.mutateAsync(submittedData),
            uploadResumeOrCVMutation.mutateAsync(submittedData),
          ]);
        await Promise.all([
          putFreelancerProfileByUserIdMutation.mutateAsync({
            ...submittedData,
            passportOrIdImage: uploadedPassportOrId || [],
            resumeOrCV: uploadedResumeOrCV || [],
          }),
          updateSessionMutation.mutateAsync(user),
        ]);
        toast.success("Freelancer profile created successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
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
      } finally {
        window.scrollTo(0, 0);
        router.replace("/")
      }
    });

    const LoadingSpinner = () => {
      if (
        patchUserByIdMutation.isLoading ||
        uploadPassportOrIdMutation.isLoading ||
        uploadResumeOrCVMutation.isLoading ||
        updateSessionMutation.isLoading ||
        putFreelancerProfileByUserIdMutation.isLoading
      ) {
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

    const SkillCheckBoxes = () => {
      if (!freelancerType) {
        return <></>;
      }
      const transformedSkillOptions = Object.fromEntries(
        Object.entries(skillOptionsBasedOnType).map(([key, value]) => [
          key,
          value.map((option) => option.value),
        ])
      );
      return transformedSkillOptions[freelancerType].map((skill, index) => {
        return (
          <div key={index}>
            <label className="cursor-pointer flex p-3 w-fit bg-white border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
              <input
                type="checkbox"
                {...register("skills")}
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

    const { getRootProps, getInputProps } = useDropzone({
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
        toast.error(fileRejections[0].errors[0].message, {
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

    const uploadPassportOrIdMutation = useMutation<
      | {
          fileUrl: string;
          fileKey: string;
        }[]
      | undefined,
      Error,
      RegisterFreelancer
    >({
      mutationFn: async (data) => {
        const uploadedFile = await startUpload(data.passportOrIdImage);
        if (!uploadedFile) {
          throw new Error("upload failed");
        }
        return uploadedFile;
      },
    });

    const updateSessionMutation = useMutation<
      Session | null,
      Error,
      IResponseDataPATCHUserById
    >({
      mutationFn: async (data) => {
        const res = await update({
          name: data.data.name,
          role: data.data.role,
        });
        return res;
      },
    });

    const uploadResumeOrCVMutation = useMutation<
      | {
          fileUrl: string;
          fileKey: string;
        }[]
      | undefined,
      Error,
      RegisterFreelancer
    >({
      mutationFn: async (data) => {
        const uploadedFile = await startUpload(data.resumeOrCV);
        if (!uploadedFile) {
          throw new Error("upload failed");
        }
        return uploadedFile;
      },
    });

    const putFreelancerProfileByUserIdMutation = useMutation<
      any,
      Error,
      RegisterFreelancer
    >({
      mutationFn: async (data) => {
        const res = await fetch(
          endpoints.API.freelancerProfileByUserId(session?.user.sub || ""),
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }
        return res.json();
      },
    });

    const patchUserByIdMutation = useMutation<
      IResponseDataPATCHUserById,
      Error,
      RegisterFreelancer
    >({
      mutationFn: async (data) => {
        const updatedName = data.firstName + " " + data.lastName;
        const res = await fetch(
          endpoints.API.userById(session?.user.sub || ""),
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: updatedName,
              role: "FREELANCER",
              ...(session?.user.email && { email: session.user.email }),
            }),
          }
        );
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }
        return res.json();
      },
    });

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
                  onDrop={async (acceptedFiles) => {
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
        <div className="grid grid-cols-1 gap-4 mt-8">
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
                      setValue("skills", [] as any);
                    }}
                    options={freelancerTypeOptions}
                    isDisabled={false}
                    isClearable={false}
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
          <div className="flex flex-col">
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">
              Skills
            </label>
            <div className="dark:bg-slate-900 dark:border-gray-700 dark:text-white border-[1px] p-6 rounded-md gap-5 flex flex-wrap">
              <SkillCheckBoxes />
            </div>
            {errors.skills?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.skills.message}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">
              Resume or CV
            </label>
            <div className="flex rounded-md shadow-sm">
              <Controller
                control={control}
                name="resumeOrCV"
                render={({ field: { onChange, onBlur } }) => (
                  <Dropzone
                    noClick
                    accept={{ "application/pdf": [] }}
                    onDropAccepted={async (acceptedFiles) => {
                      setValue("resumeOrCV", acceptedFiles, {
                        shouldValidate: true,
                      });
                    }}
                    onDropRejected={(fileRejections) => {
                      toast.error(fileRejections[0].errors[0].message, {
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
                    }}
                    maxFiles={1}
                  >
                    {({ getRootProps, getInputProps, open }) => (
                      <>
                        <div
                          className="cursor-pointer py-3 px-4 inline-flex flex-shrink-0 justify-center items-center gap-2 rounded-l-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:z-10 focus:outline-none focus:ring-2 transition-all text-sm"
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

                          <p className="dark:text-white">Choose file</p>
                        </div>
                      </>
                    )}
                  </Dropzone>
                )}
              />
              <input
                disabled
                type="text"
                value={
                  resumeOrCV && resumeOrCV.length > 0 && !resumeOrCV[0].errors
                    ? resumeOrCV[0].name
                    : "No file chosen"
                }
                id="hs-leading-button-add-on"
                name="hs-leading-button-add-on"
                className="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-r-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 border-[1px]"
              />
            </div>
            {errors.resumeOrCV?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.resumeOrCV.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-8">
          <div>
            <p className="text-white font-bold text-xl mb-4">Links</p>
            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-2 dark:text-gray-400">
                LinkedIn URL
              </label>
              <input
                {...register("linkedInURL", { disabled: false })}
                type="text"
                className=" disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
                placeholder=""
              />
              {errors.linkedInURL?.message && (
                <p className="text-xs font-semibold text-red-600 mt-2">
                  {errors.linkedInURL.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              Github URL
            </label>
            <input
              {...register("githubURL", { disabled: false })}
              type="text"
              className=" disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
              placeholder=""
            />
            {errors.githubURL?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.githubURL.message}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              Portfolio URL
            </label>
            <input
              {...register("portfolioURL", { disabled: false })}
              type="text"
              className=" disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
              placeholder=""
            />
            {errors.portfolioURL?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.portfolioURL.message}
              </p>
            )}
          </div>
        </div>
        <div className="border-t-[2px] border-gray-700 mt-8" />
        <div className="grid grid-cols-1 gap-4 mt-8">
          <p className="text-white font-bold text-xl">Submit Application</p>
          <p className="font-medium text-gray-400">
            In order to contact you, we need to store your personal data. If you
            are happy for us to do so please click the checkbox below.
          </p>
          <div className="flex flex-col">
            <label className="cursor-pointer flex p-3 w-fit bg-white border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400">
              <input
                type="checkbox"
                {...register("term")}
                className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-500 ml-3 dark:text-gray-400">
                Allow us to process your personal information
              </span>
            </label>
            {errors.term?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.term.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          >
            <LoadingSpinner />
            Submit application
          </button>
        </div>
      </form>
    );
  };

  if (data?.data) {
    return (
      <UnauthorisedAccess
        title={"You already have a freelancer profile"}
        description={
          "If you would like to edit your freelancer profile, please click the link below"
        }
        linkMessage={"Go to my freelancer profile page"}
      />
    );
  }

  return (
    <main className="">
      <div className="max-w-[85rem] mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <h1 className="text-white font-bold text-3xl mb-6">
            Freelancer Registration
          </h1>
          <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            {session && <RegisterFreelancerForm />}
          </div>
        </div>
      </div>
    </main>
  );
}
