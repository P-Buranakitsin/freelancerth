"use client";

import { MoreInfo, MoreInfoSchema } from "@/models/MoreInfo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select, { Options } from "react-select";
import DatePicker from "react-multi-date-picker";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { endpoints } from "@/constants/endpoints";
import { Country } from "@prisma/client";

interface CountryOptionProps {
  value: Country;
  label: Country;
  isDisabled: boolean;
}

const countryOptions: Options<CountryOptionProps> = [
  { value: "UK", label: "UK", isDisabled: false },
];

export default function MoreInfoSection() {
  const { data: session } = useSession();
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const { data }: { data: IResponseDataGETProfileByUserId | undefined } = useQuery({
    queryKey: ["profile"],
    enabled: !!session,
  });

  const MoreInfoForm = () => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
    } = useForm<MoreInfo>({
      resolver: zodResolver(MoreInfoSchema),
      defaultValues: {
        address: data?.data?.address || "",
        city: data?.data?.city || "",
        dob: data?.data?.dob || undefined,
        phoneNumber: data?.data?.phoneNumber || "",
        zip: data?.data?.zip || "",
        country: countryOptions[0].value,
      },
    });

    const client = useQueryClient();

    const mutation = useMutation<any, Error, MoreInfo>({
      mutationFn: async (data) => {
        const res = await fetch(endpoints.profileByUserId(session?.user.sub || ''), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(session?.user.sub && { userId: session.user.sub }),
            address: data.address || "",
            country: data.country || "",
            city: data.city || "",
            phoneNumber: data.phoneNumber || "",
            dob: data.dob || null,
            zip: data.zip || "",
          }),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }
        return res.json();
      },
      onSuccess: async () => {
        await client.invalidateQueries({ queryKey: ["profile"] });
        toast.success("Info Updated", {
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
      onSettled: () => {
        setIsEditable(false);
      },
    });

    const onSubmit = handleSubmit(async (data) => {
      if (isEditable) {
        console.log(data);
        mutation.mutate(data);
      } else {
        setIsEditable(true);
      }
    });

    const cancelOnClick = () => {
      setIsEditable(false);
    };

    return (
      <form onSubmit={onSubmit}>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div className=" flex flex-col md:col-span-2">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              Address
            </label>
            <input
              {...register("address", { disabled: !isEditable })}
              type="text"
              className="disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
              placeholder="Argyle St."
            />
            {errors.address?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.address.message}
              </p>
            )}
          </div>
          <div className=" flex flex-col">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              Country
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
                      backgroundColor: isEditable ? "#0F172A" : "#1F2937",
                      borderColor: "#374151",
                    }),
                    singleValue: (baseStyles) => ({
                      ...baseStyles,
                      color: "#FFFFFF",
                    }),
                  }}
                  value={countryOptions.find((c) => c.value === field.value)}
                  onChange={(val) => field.onChange(val?.value)}
                  options={countryOptions}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  isDisabled={!isEditable}
                />
              )}
              name="country"
            />

            {errors.country?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.country.message}
              </p>
            )}
          </div>
          <div className=" flex flex-col">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              City
            </label>
            <input
              {...register("city", { disabled: !isEditable })}
              type="text"
              className="disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
              placeholder="Glasgow"
            />
            {errors.city?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.city.message}
              </p>
            )}
          </div>
          <div className=" flex flex-col">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              Phone Number
            </label>
            <input
              {...register("phoneNumber", { disabled: !isEditable })}
              type="text"
              className="disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
              placeholder="0000-00000"
            />
            {errors.phoneNumber?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className=" flex flex-col">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              Birthday
            </label>
            <Controller
              control={control}
              name="dob"
              rules={{ required: true }} //optional
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  value={value || ""}
                  onChange={(date) => {
                    onChange(date);
                  }}
                  format={"DD/MM/YYYY"}
                  disabled={!isEditable}
                  inputClass="disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
                  placeholder="15/06/1997"
                />
              )}
            />
            {errors.dob?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.dob.message}
              </p>
            )}
          </div>
          <div className=" flex flex-col md:col-span-2">
            <label className="block text-sm font-medium mb-2 dark:text-gray-400">
              Zip/postal Code
            </label>
            <input
              {...register("zip", { disabled: !isEditable })}
              type="text"
              className="disabled:bg-gray-800 placeholder-gray-500 border-[1px] py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
              placeholder="123456"
            />
            {errors.zip?.message && (
              <p className="text-xs font-semibold text-red-600 mt-2">
                {errors.zip.message}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row md:col-span-2 mt-6 justify-end space-x-2">
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
            >
              {mutation.isLoading && (
                <>
                  <span
                    className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
                    role="status"
                    aria-label="loading"
                  ></span>
                </>
              )}
              {isEditable ? "Save Changes" : "Edit"}
            </button>
            {isEditable && (
              <button
                type="button"
                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm dark:text-white dark:hover:bg-gray-900 dark:hover:border-gray-900 dark:focus:ring-gray-900 dark:focus:ring-offset-gray-800"
                onClick={cancelOnClick}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <p className="text-white font-bold text-xl">Additional Information</p>
      <p className="text-gray-400 mt-2 mb-6">
        Please fill in the form below if you want others to know more about you.
      </p>
      {data && <MoreInfoForm />}
    </div>
  );
}
