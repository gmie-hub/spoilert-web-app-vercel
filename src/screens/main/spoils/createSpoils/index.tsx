"use client";

import { useState } from "react";

import Stack from "@mui/material/Stack";
import Image from "next/image";

import AdvancedSpoilIcon from "@spt/assets/icons/advanced-spoil.svg";
import SimpleSpoilIcon from "@spt/assets/icons/simple-spoil.svg";
import Button from "@spt/components/button";

const CreateSpoil = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const spoilTypes = [
    {
      icon: SimpleSpoilIcon,
      title: "Simple Spoil",
      description: "Create a spoil with single lessons",
    },
    {
      icon: AdvancedSpoilIcon,
      title: "Advanced Spoil",
      description: "Create a spoil with multiple lessons",
    },
  ];

  return (
    <Stack
      mr={{ xs: 2, md: 20 }}
      ml={{ xs: 2, md: 10 }}
      my={{ xs: 2, md: 6 }}
      spacing={6}
    >
      <h3 className="text-2xl text-black font-semibold">Create Spoil</h3>

      <Stack alignItems="center">
        <Stack width="fit-content" spacing={4}>
          <Stack alignItems={{ md: "center" }} spacing={{ md: 1 }}>
            <h1 className="text-xl md:text-[32px] text-black font-semibold">
              Choose Spoil Type
            </h1>

            <p className="md:text-center">
              Select the type of spoil you want to create. Choose the option
              that best fits how detailed you <br /> want your spoil to be.
            </p>
          </Stack>

          <Stack direction="row" spacing={{ xs: 2, md: 4 }} width="100%">
            {spoilTypes.map((type, index) => (
              <Stack
                key={index}
                spacing={1}
                flex={{ md: 1 }}
                width={{ md: "100%" }}
                onClick={() => handleSelect(index)}
                className={`border rounded-xl p-4 
                cursor-pointer 
                hover:shadow-lg 
                transition-shadow 
                duration-300
                active:border-blue-primary
                ${selectedIndex === index ? "border-blue bg-blue-cool" : "border-gray-lightest"}
                `}
              >
                <Image
                  src={type.icon}
                  alt={type.title}
                  width={24}
                  height={24}
                  className="md:h-[40px] md:w-[40px]"
                />

                <Stack spacing={1}>
                  <h2 className="md:text-xl text-black font-semibold">
                    {type.title}
                  </h2>
                  <p className="text-xs md:text-base">{type.description}</p>
                </Stack>
              </Stack>
            ))}
          </Stack>

          <Button>Save and Continue</Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CreateSpoil;
