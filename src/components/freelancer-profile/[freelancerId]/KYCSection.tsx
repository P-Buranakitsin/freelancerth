"use client";

import { endpoints } from "@/constants/endpoints";
import { useFreelancerProfile } from "@/hooks/useQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Dropzone, { FileRejection, FileWithPath } from "react-dropzone";
import { useUploadThing } from "@/utils/uploadthing";
import { PutFreelancerProfile, PutFreelancerProfileSchema } from "@/models/FreelancerProfile/PutFreelancerProfileAPI";

interface IKYCSectionProps {
  session: Session;
}

type TInitialData = {
  passportOrId: string;
  resumeOrCV: string;
};

export default function KYCSection(props: IKYCSectionProps) {
  const { data } = useFreelancerProfile(props.session);

  const KYCForm = ({ initData }: { initData: TInitialData }) => {
    const {
      handleSubmit,
      formState: { errors },
      watch,
      control,
      setError,
      setValue,
    } = useForm<PutFreelancerProfile>({
      resolver: zodResolver(PutFreelancerProfileSchema),
      defaultValues: {
        passportOrId: initData.passportOrId,
        resumeOrCV: initData.resumeOrCV,
      },
    });

    const passportOrId = watch("passportOrId");
    const resumeOrCV = watch("resumeOrCV");

    const client = useQueryClient();

    const { startUpload } = useUploadThing({
      endpoint: "imageOrFileUploader",
    });

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

    const KYCMutation = useMutation<any, Error, PutFreelancerProfile>({
      mutationFn: async (data) => {
        const res = await fetch(
          endpoints.API.freelancerProfileByUserId(props.session.user.sub || ""),
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              resumeOrCV: data.resumeOrCV,
              passportOrId: data.passportOrId,
            }),
          }
        );
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }
        return res.json();
      },
      onSuccess: async () => {
        await client.invalidateQueries({
          queryKey: [
            "freelancerProfileByUserId",
            props.session?.user.sub || "",
          ],
        });
        toast.success("KYC Updated", {
          toastId: "descriptionSection",
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
          toastId: "descriptionSection",
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

    const isLoading = uploadImageMutation.isLoading || KYCMutation.isLoading;

    const onSubmit = handleSubmit(async (data) => {
      console.log(data);
    });

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

    return (
      <form onSubmit={onSubmit} className="mt-8">
        <div className="flex flex-col">
          <label className="mb-2 block text-sm font-medium dark:text-gray-400">
            Passport or ID
          </label>
          <div className="flex flex-wrap gap-5 my-4">
            <div className="w-[300px] h-[300px] box-border inline-flex">
              <div className="flex overflow-hidden">
                <Image
                  src={passportOrId || ""}
                  alt=""
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </div>
          <Controller
            control={control}
            name="passportOrId"
            render={({ field: { onChange, onBlur } }) => (
              <Dropzone
                noClick
                disabled={isLoading}
                accept={{ "image/*": [] }}
                onDropRejected={(fileRejections: FileRejection[]) => {
                  setError("passportOrId", {
                    message: fileRejections[0].errors[0].message,
                  });
                }}
                onDropAccepted={async (acceptedFiles: FileWithPath[]) => {
                  const uploadedImage = await uploadImageMutation.mutateAsync({
                    acceptedFiles,
                  });
                  KYCMutation.mutate({
                    passportOrId: uploadedImage[0].fileUrl,
                  });
                }}
                maxFiles={1}
              >
                {({ getRootProps, getInputProps, open }) => (
                  <div>
                    <div
                      className={`dark:bg-slate-900 cursor-pointer dark:border-gray-700 border-dashed border-2 p-10 rounded-md gap-5 flex flex-wrap justify-center items-center`}
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
                      <LoadingSpinner />
                      <p className="dark:text-gray-400">
                        Drag and drop some files here, or click to select files
                      </p>
                    </div>
                  </div>
                )}
              </Dropzone>
            )}
          />
          {errors.passportOrId?.message && (
            <p className="text-xs font-semibold text-red-600 mt-2">
              {errors.passportOrId.message}
            </p>
          )}
        </div>
        <div className="flex flex-col mt-5">
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
                  disabled={isLoading}
                  accept={{ "application/pdf": [] }}
                  onDropAccepted={async (acceptedFiles) => {
                    const uploadedImage = await uploadImageMutation.mutateAsync(
                      {
                        acceptedFiles,
                      }
                    );
                    KYCMutation.mutate({
                      resumeOrCV: uploadedImage[0].fileUrl,
                    });
                  }}
                  onDropRejected={(fileRejections) => {
                    console.log(fileRejections);
                    setError("resumeOrCV", {
                      message: fileRejections[0].errors[0].message,
                    });
                  }}
                  maxFiles={1}
                >
                  {({ getRootProps, getInputProps, open }) => (
                    <>
                      <div
                        className={`cursor-pointer hover:bg-blue-600 py-3 px-4 inline-flex flex-shrink-0 justify-center items-center gap-2 rounded-l-md border border-transparent font-semibold bg-blue-500 text-white focus:z-10 focus:outline-none focus:ring-2 transition-all text-sm`}
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
                        <LoadingSpinner />
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
              value={resumeOrCV}
              id="hs-leading-button-add-on"
              name="hs-leading-button-add-on"
              className="rounded-r-md py-3 px-4 block w-full border-gray-200 shadow-sm text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 border-[1px]"
            />
          </div>
          {errors.resumeOrCV?.message && (
            <p className="text-xs font-semibold text-red-600 mt-2">
              {errors.resumeOrCV.message}
            </p>
          )}
        </div>
      </form>
    );
  };

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <p className="text-white font-bold text-xl">Know Your Customer (KYC)</p>
      <p className="text-gray-400 mt-2">
        Anything uploaded in this section will be reviewed by one of our admins
        to verify you.
      </p>
      {data && (
        <KYCForm
          initData={{
            passportOrId: data.data?.passportOrId || "",
            resumeOrCV: data.data?.resumeOrCV || "",
          }}
        />
      )}
    </div>
  );
}
