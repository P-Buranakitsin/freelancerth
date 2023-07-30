"use client";

import { useFreelancerProfile } from "@/hooks/useQuery";
import { Session } from "next-auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Skill, SkillSchema } from "@/models/FreelancerProfile/Skill";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/constants/endpoints";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IFreelancerSkillSectionProps {
  session: Session;
}

export default function FreelancerSkillSection(
  props: IFreelancerSkillSectionProps
) {
  const { data } = useFreelancerProfile(props.session);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const FreelancerSkillForm = () => {
    const { register, handleSubmit } = useForm<Skill>({
      resolver: zodResolver(SkillSchema),
      defaultValues: {
        skills: data?.data?.skills || [],
      },
    });

    const client = useQueryClient();

    const skillMutation = useMutation<any, Error, Skill>({
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
        toast.success("Bio Updated", {
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

    return <form onSubmit={onSubmit}></form>;
  };

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <p className="text-white font-bold text-xl">Freelancer Type</p>
      <p className="text-gray-400 mt-2">{data?.data?.type || ""}</p>
      {data && <FreelancerSkillForm />}
    </div>
  );
}
