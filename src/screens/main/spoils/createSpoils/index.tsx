"use client";

import { useMemo, useState } from "react";
import { useAuthStore } from "@spt/store/authStore";

import Stack from "@mui/material/Stack";
import Image from "next/image";
import { useRouter } from "next/navigation";

import AdvancedSpoilIcon from "@spt/assets/icons/advanced-spoil.svg";
import SimpleSpoilIcon from "@spt/assets/icons/simple-spoil.svg";
import Button from "@spt/components/button";

import type { SpoilTypeOption } from "./types";

const CreateSpoil = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<SpoilTypeOption | null>(
    null,
  );

  const spoilTypes = useMemo(
    () => [
      {
        icon: SimpleSpoilIcon,
        title: "Simple Spoil",
        description: "Create a spoil with single lessons",
        value: "simple" as const,
      },
      {
        icon: AdvancedSpoilIcon,
        title: "Advanced Spoil",
        description: "Create a spoil with multiple lessons",
        value: "advanced" as const,
      },
    ],
    [],
  );

  const handleSelect = (value: SpoilTypeOption) => {
    setSelectedType(value);
  };

  const handleSelectionContinue = () => {
    if (!selectedType) return;

    // clear any previously stored created spoil id when starting a new flow
    const setCreatedSpoilId = useAuthStore.getState().setCreatedSpoilId;
    setCreatedSpoilId?.(null);

    if (selectedType === "advanced") {
      router.push("/create-spoils/advance-spoil");
    } else {
      router.push("/create-spoils/simple-spoil");
    }
  };

  return (
    <Stack
      mr={{ xs: 2, md: 20 }}
      ml={{ xs: 2, md: 10 }}
      my={{ xs: 2, md: 6 }}
      spacing={6}
    >
      <h3 className="text-2xl font-semibold text-black">Create Spoil</h3>

      <Stack alignItems="center">
        <Stack width="fit-content" spacing={4}>
          <Stack alignItems={{ md: "center" }} spacing={{ md: 1 }}>
            <h1 className="text-xl font-semibold text-black md:text-[32px]">
              Choose Spoil Type
            </h1>

            <p className="text-center text-sm md:text-base">
              Select the type of spoil you want to create. Choose the option
              that best fits how detailed you want your spoil to be.
            </p>
          </Stack>

          <Stack direction="row" spacing={{ xs: 2, md: 4 }} width="100%">
            {spoilTypes.map((type) => (
              <Stack
                key={type.value}
                spacing={1}
                flex={{ md: 1 }}
                width={{ md: "100%" }}
                onClick={() => handleSelect(type.value)}
                className={`border rounded-xl p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 active:border-blue-primary ${
                  selectedType === type.value
                    ? "border-[var(--color-blue)] bg-blue-cool"
                    : "border-gray-lightest"
                }`}
              >
                <Image
                  src={type.icon}
                  alt={type.title}
                  width={24}
                  height={24}
                  className="md:h-[40px] md:w-[40px]"
                />

                <Stack spacing={1}>
                  <h2 className="text-black font-semibold md:text-xl">
                    {type.title}
                  </h2>
                  <p className="text-xs md:text-base">{type.description}</p>
                </Stack>
              </Stack>
            ))}
          </Stack>

          <Button disabled={!selectedType} onClick={handleSelectionContinue}>
            Save and Continue
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CreateSpoil;
