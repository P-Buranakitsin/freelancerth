"use client";

import { CreateGig, CreateGigSchema } from "@/models/CreateGig";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BusinessAnalystSkill,
  DesignerSkill,
  DevOpsEngineerSkill,
  DeveloperSkill,
  FreelancerType,
  GigType,
  ProjectManagerSkill,
  TesterSkill,
} from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { CSSProperties, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import Select, { Options } from "react-select";

interface FreelancerTypeOptionProps {
  value: FreelancerType;
  label: FreelancerType;
  isDisabled: boolean;
}

interface GigTypeOptionProps {
  value: GigType;
  label: GigType;
  isDisabled: boolean;
}

interface FileWithPreview extends FileWithPath {
  preview?: string;
}

type SkillOptions = {
  [FreelancerType.DEVELOPERS]: DeveloperSkill[];
  [FreelancerType.DESIGNERS]: DesignerSkill[];
  [FreelancerType.TESTERS]: TesterSkill[];
  [FreelancerType.PROJECT_MANAGERS]: ProjectManagerSkill[];
  [FreelancerType.DEVOPS_ENGINEERS]: DevOpsEngineerSkill[];
  [FreelancerType.BUSINESS_ANALYSTS]: BusinessAnalystSkill[];
};

const freelancerTypeOptions: Options<FreelancerTypeOptionProps> = [
  { value: "DEVELOPERS", label: "DEVELOPERS", isDisabled: false },
  { value: "DESIGNERS", label: "DESIGNERS", isDisabled: false },
  { value: "TESTERS", label: "TESTERS", isDisabled: false },
  { value: "PROJECT_MANAGERS", label: "PROJECT_MANAGERS", isDisabled: false },
  { value: "DEVOPS_ENGINEERS", label: "DEVOPS_ENGINEERS", isDisabled: false },
  { value: "BUSINESS_ANALYSTS", label: "BUSINESS_ANALYSTS", isDisabled: false },
];

const gigTypeOptions: Options<GigTypeOptionProps> = [
  { value: "INDIVIDUAL", label: "INDIVIDUAL", isDisabled: false },
  { value: "TEAM", label: "TEAM", isDisabled: true },
];

const skillOptions: SkillOptions = {
  DEVELOPERS: ["JAVASCRIPT", "GOLANG", "JAVA", "PYTHON"],
  BUSINESS_ANALYSTS: ["DATA_ANALYSIS", "REQUIREMENTS_ANALYSIS"],
  DESIGNERS: ["FIGMA", "ILLUSTRATOR", "PHOTOSHOP"],
  DEVOPS_ENGINEERS: ["DOCKER", "KUBERNETES"],
  PROJECT_MANAGERS: ["AGILE_METHODOLOGY", "PROJECT_PLANNING"],
  TESTERS: ["CYPRESS", "JEST", "POSTMAN"],
};

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb: CSSProperties = {
  display: "inline-flex",
  borderRadius: 2,
  marginBottom: 8,
  marginRight: 16,
  width: 300,
  height: 300,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

export default function CreateGigSection() {
  const { data: session, update } = useSession();

  const CreateGigForm = () => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
      watch,
      reset,
      getValues,
    } = useForm<CreateGig>({
      resolver: zodResolver(CreateGigSchema),
      defaultValues: {
        skills: [],
        freelancerType: freelancerTypeOptions[0].value,
        gigType: gigTypeOptions[0].value,
      },
    });
    const onSubmit = handleSubmit(async (data) => {
      console.log(data);
    });

    const freelancerType = watch("freelancerType");

    const SkillCheckBoxes = () => {
      return skillOptions[freelancerType].map((skill, index) => {
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

    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const { getRootProps, getInputProps } = useDropzone({
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
      maxFiles: 1,
    });

    const thumbs = files.map((file) => (
      <div style={thumb as CSSProperties} key={file.name}>
        <div style={thumbInner}>
          <Image
            src={file.preview || ""}
            style={img}
            // Revoke data uri after image is loaded
            onLoad={() => {
              URL.revokeObjectURL(file.preview || "");
            }}
            alt=""
            width={500}
            height={500}
          />
        </div>
      </div>
    ));

    useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () =>
        files.forEach((file) => URL.revokeObjectURL(file.preview || ""));
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
              placeholder="Bonnie"
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
              placeholder="Write your description here."
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
                    });
                  }}
                  options={freelancerTypeOptions}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  isDisabled={false}
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
              Gig Photos
            </label>
            <section className="">
              <aside style={thumbsContainer as CSSProperties}>{thumbs}</aside>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <p>Drag and drop some files here, or click to select files</p>
              </div>
            </section>
          </div>
          <div className="flex flex-col mt-4 justify-center items-end">
            <button
              type="submit"
              className="w-fit py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
            >
              Publish
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      {<CreateGigForm />}
    </div>
  );
}
