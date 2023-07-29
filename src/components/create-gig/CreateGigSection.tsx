"use client";

import { endpoints } from "@/constants/endpoints";
import { CreateGig, CreateGigSchema } from "@/models/CreateGig";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect } from "react";
import Dropzone from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUploadThing } from "@/utils/uploadthing";
import {
  freelancerTypeOptions,
  gigTypeOptions,
} from "@/constants/react-select";

interface ICreateGigSectionProps {
  freelancerProfile: IResponsGETFreelancerProfileByUserId;
}

export default function CreateGigSection(props: ICreateGigSectionProps) {
  const data = props.freelancerProfile;

  const CreateGigForm = ({
    initData,
  }: {
    initData: IResponsGETFreelancerProfileByUserId;
  }) => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
      watch,
      reset,
      getValues,
      setValue,
    } = useForm<CreateGig>({
      resolver: zodResolver(CreateGigSchema),
      defaultValues: {
        skills: [],
        freelancerType: initData.data?.type || undefined,
        gigType: gigTypeOptions[0].value,
        gigPrice: 1,
        gigImage: [],
      },
    });


    const uploadImageMutation = useMutation<CreateGig, Error, CreateGig>({
      mutationFn: async (data) => {
        const uploadedFile = await startUpload(data.gigImage);
        if (!uploadedFile) {
          throw new Error("upload failed");
        }
        return {
          ...data,
          gigImage: uploadedFile,
        };
      },
    });

    const createGigMutation = useMutation<any, Error, CreateGig>({
      mutationFn: async (data) => {
        const res = await fetch(endpoints.API.gigs({}), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        return res.json();
      },
    });

    const { startUpload } = useUploadThing({
      endpoint: "imageOrFileUploader",
    });

    const onSubmit = handleSubmit(async (data) => {
      try {
        const res = await uploadImageMutation.mutateAsync(data);
        createGigMutation.mutateAsync(res);
        toast.success("Gig created successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        reset();
        window.scrollTo(0, 0);
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
    });

    const LoadingSpinner = () => {
      if (uploadImageMutation.isLoading || createGigMutation.isLoading) {
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

    const gigImage = watch("gigImage");

    const SkillCheckBoxes = () => {
      if (!data?.data) {
        return <></>;
      }
      return data?.data.skills.map((skill, index) => {
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

    const Thumbs = gigImage.map((file) => {
      return (
        <div
          className="w-[300px] h-[300px] box-border inline-flex"
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

    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () =>
        gigImage.forEach((file) => URL.revokeObjectURL(file.preview || ""));
    }, []);

    return (
      <form onSubmit={onSubmit}>
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
                    reset({
                      ...getValues(),
                      skills: [], // Reset selected skills to an empty array
                      gigPrice: 1,
                    });
                  }}
                  options={freelancerTypeOptions}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  isDisabled={true}
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
          <div className="flex flex-col">
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">
              Gig Type
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
                  value={gigTypeOptions.find((c) => c.value === field.value)}
                  onChange={(val) => field.onChange(val?.value)}
                  options={gigTypeOptions}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  isDisabled={false}
                />
              )}
              name="gigType"
            />
            {errors.gigType?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.gigType.message}
              </p>
            )}
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
            <div className="flex flex-wrap gap-5 my-4">{Thumbs}</div>

            {/* Code from https://github.com/orgs/react-hook-form/discussions/2146 */}
            <Controller
              control={control}
              name="gigImage"
              render={({ field: { onChange, onBlur } }) => (
                <Dropzone
                  noClick
                  accept={{ "image/*": [] }}
                  onDrop={(acceptedFiles: any[]) => {
                    setValue(
                      "gigImage",
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
            {errors.gigImage?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.gigImage.message}
              </p>
            )}
          </div>
          <div className="flex flex-col mt-4 justify-center items-end">
            <button
              type="submit"
              className="w-fit py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
            >
              <LoadingSpinner />
              Publish
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <main className="">
      <div className="max-w-[85rem] mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <h1 className="text-white font-bold text-3xl mb-6">Gig Creation</h1>
          <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            {<CreateGigForm initData={data} />}
          </div>
        </div>
      </div>
    </main>
  );
}
