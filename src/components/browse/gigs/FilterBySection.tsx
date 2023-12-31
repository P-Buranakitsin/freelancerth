"use client";

import { FilterGig, FilterGigSchema } from "@/models/FilterGig";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select, { Options } from "react-select";
import { components } from "react-select";
import { useSearchParams, useRouter } from "next/navigation";
import { endpoints } from "@/constants/endpoints";
import { freelancerTypeOptions, skillOptionsBasedOnType } from "@/constants/react-select";

const skillOptions = Object.values(skillOptionsBasedOnType).reduce(
  (acc, val) => acc.concat(val),
  []
);

const gigTypeOptions: Options<GigTypeOptionProps> = [
  { value: "INDIVIDUAL", label: "INDIVIDUAL", isDisabled: false },
  { value: "TEAM", label: "TEAM", isDisabled: true },
];

const startingPriceOptions: Options<StartingOptionProps> = [
  { value: "CHEAP", label: "Less than £19.99", isDisabled: false },
  { value: "NORMAL", label: "£19.99 - £99.99", isDisabled: false },
  { value: "EXPENSIVE", label: "More than £99.99", isDisabled: false },
];

export default function FilterBySection() {
  const searchParams = useSearchParams();
  const limit = Number(searchParams.get("limit")) || 6;
  const title = searchParams.get("title") || "";
  const freelancerTypeParam =
    (searchParams.get("freelancerType") as FreelancerType) || undefined;
  const skillsParams = searchParams.getAll("skills") || undefined;
  const gigTypeParam = (searchParams.get("gigType") as GigType) || undefined;
  const priceParam = searchParams.get("price") || undefined;

  const router = useRouter();

  const FilterByForm = () => {
    const {
      control,
      handleSubmit,
      register,
      reset,
      watch,
      formState: { errors },
      setValue,
    } = useForm<FilterGig>({
      resolver: zodResolver(FilterGigSchema),
      defaultValues: {
        gigTitle: title,
        freelancerType: freelancerTypeParam,
        skills: skillsParams as SkillName[],
        gigType: gigTypeParam,
        startingPrice: priceParam as "CHEAP" | "NORMAL" | "EXPENSIVE",
      },
    });

    const NoOptionsMessage = (props: any) => {
      return (
        <components.NoOptionsMessage {...props}>
          <span className="custom-css-class">Select Freelancer Type First</span>
        </components.NoOptionsMessage>
      );
    };

    const onSubmit = handleSubmit(async (data) => {
      console.log(data);
      router.push(
        endpoints.PAGE.gigs({
          page: 0,
          limit,
          title: data.gigTitle,
          freelancerType: data.freelancerType,
          skills: data.skills,
          gigType: data.gigType,
          price: data.startingPrice,
        })
      );
    });

    const defaultOnClick = () => {
      reset({
        gigTitle: "",
        skills: undefined,
        freelancerType: undefined,
        gigType: undefined,
        startingPrice: undefined,
      });
      router.push(
        endpoints.PAGE.gigs({
          page: 0,
          limit: 6,
        })
      );
    };

    const freelancerType = watch("freelancerType");
    const skills = watch("skills");
    const startingPrice = watch("startingPrice");
    const gigType = watch("gigType");

    return (
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              Gig Title
            </label>
            <input
              {...register("gigTitle", { disabled: false })}
              type="text"
              className=" disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
            />
            {errors.gigTitle?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.gigTitle.message}
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
                  isClearable={true}
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
                  value={
                    freelancerType
                      ? freelancerTypeOptions.find(
                          (c) => c.value === freelancerType
                        )
                      : null
                  }
                  onChange={(val) => {
                    field.onChange(val?.value);
                    setValue("skills", undefined);
                  }}
                  options={freelancerTypeOptions}
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
              Skills
            </label>
            <Controller
              control={control}
              render={({ field: { onChange } }) => (
                <Select
                  components={{ NoOptionsMessage }}
                  className=""
                  styles={{
                    container: (baseStyles) => ({
                      ...baseStyles,
                      minHeight: 46,
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
                  defaultValue={null}
                  value={
                    freelancerType && skills
                      ? skillOptionsBasedOnType[freelancerType]
                          .filter((option) =>
                            skills.includes(option.value as any)
                          )
                          .sort(
                            (a, b) =>
                              skills.indexOf(a.value as any) -
                              skills.indexOf(b.value as any)
                          )
                      : skills
                      ? skillOptions
                          .filter((option) =>
                            skills.includes(option.value as any)
                          )
                          .sort(
                            (a, b) =>
                              skills.indexOf(a.value as any) -
                              skills.indexOf(b.value as any)
                          )
                      : null
                  }
                  onChange={(val) => onChange(val.map((el) => el.value))}
                  options={
                    freelancerType
                      ? skillOptionsBasedOnType[freelancerType]
                      : skillOptions
                  }
                  isClearable={true}
                  isDisabled={false}
                  isMulti={true}
                />
              )}
              name="skills"
            />
            {errors.skills?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.skills.message}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">
              Gig Type
            </label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
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
                  value={
                    gigType
                      ? gigTypeOptions.find((c) => c.value === gigType)
                      : null
                  }
                  onChange={(val) => onChange(val?.value)}
                  options={gigTypeOptions}
                  isClearable
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
              Starting Price (GBP)
            </label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
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
                  value={
                    startingPrice
                      ? startingPriceOptions.find(
                          (c) => c.value === startingPrice
                        )
                      : null
                  }
                  onChange={(val) => onChange(val?.value)}
                  options={startingPriceOptions}
                  isClearable
                  isDisabled={false}
                />
              )}
              name="startingPrice"
            />
            {errors.startingPrice?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.startingPrice.message}
              </p>
            )}
          </div>
          <div className="flex flex-row flex-wrap gap-3 mt-8">
            <button
              type="submit"
              className="w-fit py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
            >
              Filter
            </button>
            <button
              type="button"
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm dark:text-white dark:hover:bg-gray-900 dark:hover:border-gray-900 dark:focus:ring-gray-900 dark:focus:ring-offset-gray-800"
              onClick={defaultOnClick}
            >
              Default
            </button>
          </div>
        </div>
      </form>
    );
  };
  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <p className="text-white font-bold text-xl">Filter By</p>
      <FilterByForm />
    </div>
  );
}
