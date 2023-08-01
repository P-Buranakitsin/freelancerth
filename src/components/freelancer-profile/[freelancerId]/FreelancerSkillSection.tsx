"use client";

import { useFreelancerProfile } from "@/hooks/useQuery";
import { Session } from "next-auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/constants/endpoints";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { skillOptionsBasedOnType } from "@/constants/react-select";
import { PutFreelancerProfile, PutFreelancerProfileSchema } from "@/models/FreelancerProfile/PutFreelancerProfileAPI";

interface IFreelancerSkillSectionProps {
  session: Session;
}

interface SkillOptions {
  [key: string]: string[];
}

export default function FreelancerSkillSection(
  props: IFreelancerSkillSectionProps
) {
  const { data } = useFreelancerProfile(props.session);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const FreelancerSkillForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<PutFreelancerProfile>({
      resolver: zodResolver(PutFreelancerProfileSchema),
      defaultValues: {
        skills: data?.data?.skills || [],
      },
    });

    const skillOptions: SkillOptions = {};
    Object.entries(skillOptionsBasedOnType).forEach(([key, value]) => {
      skillOptions[key] = value.map((item) => item.value);
    });

    const client = useQueryClient();

    const skillMutation = useMutation<any, Error, PutFreelancerProfile>({
      mutationFn: async (data) => {
        const res = await fetch(
          endpoints.API.freelancerProfileByUserId(props.session.user.sub || ""),
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              skills: data.skills,
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
        toast.success("Skills Updated", {
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
        skillMutation.mutate(data);
      } else {
        setIsEditable(true);
      }
    });

    const cancelOnClick = () => {
      setIsEditable(false);
    };

    const SkillCheckBoxes = () => {
      if (!data?.data) {
        return <></>;
      }
      return skillOptions[data.data.type].map((skill, index) => {
        return (
          <div key={index}>
            <label
              className={`${
                isEditable
                  ? "cursor-pointer dark:bg-slate-900"
                  : "dark:bg-gray-800"
              } flex p-3 w-fit bg-white border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:text-gray-400`}
            >
              <input
                type="checkbox"
                {...register("skills")}
                className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                value={skill}
                disabled={!isEditable}
              />
              <span className="text-sm text-gray-500 ml-3 dark:text-gray-400">
                {skill}
              </span>
            </label>
          </div>
        );
      });
    };

    return (
      <form onSubmit={onSubmit} className="mt-3">
        <div className="flex flex-col">
          <div
            className={`${
              isEditable ? "dark:bg-slate-900" : ""
            }  dark:border-gray-700 dark:text-white border-[1px] p-6 rounded-md gap-5 flex flex-wrap`}
          >
            <SkillCheckBoxes />
          </div>
          {errors.skills?.message && (
            <p className="text-xs font-semibold text-red-600 mt-2">
              {errors.skills.message}
            </p>
          )}
        </div>
        <div className="mt-6 flex flex-row space-x-4 justify-end">
          <button
            type="submit"
            disabled={skillMutation.isLoading}
            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
          >
            {skillMutation.isLoading && (
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
      </form>
    );
  };

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <p className="text-white font-bold text-xl">Freelancer Type</p>
      <p className="text-gray-400 mt-2">{data?.data?.type || ""}</p>
      <p className="text-white font-bold text-xl mt-3">Skills</p>
      {data && <FreelancerSkillForm />}
    </div>
  );
}
