import { FC } from "react";

import Image from "next/image";

import EditIcon from "@spt/assets/icons/white-edit.svg";
import CoverImage from "@spt/assets/images/start-learning.svg";

import InfoItem from "./InfoItem";

import type { BasicsFormData } from "../../types";

interface SpoilBasicsSectionProps {
  basics: BasicsFormData;
  onEdit?: () => void;
}

const SpoilBasicsSection: FC<SpoilBasicsSectionProps> = ({
  basics,
  onEdit,
}) => {
  return (
    <section className="flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between bg-[#E6F4F7] px-3 py-2 rounded-xl">
        <h3 className="font-semibold text-blue text-lg">Spoil Basics</h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-xl bg-blue px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-opacity-90"
        >
          <Image src={EditIcon} alt="edit" width={20} height={20} /> Edit
        </button>
      </div>

      <div className="space-y-8">
        <div className="flex gap-2">
          <div className="overflow-hidden">
            {basics.coverImage ? (
              <img
                src={URL.createObjectURL(basics.coverImage as unknown as Blob)}
                alt="Cover"
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center text-gray-400">
                <Image
                  src={CoverImage}
                  alt="cover placeholder"
                  width={80}
                  height={60}
                />
              </div>
            )}
          </div>

          <button className="font-medium text-blue hover:underline">
            Change Cover Image
          </button>
        </div>

        {/* Basic Info Grid */}
        <div className="flex flex-col gap-4">
          <InfoItem
            label="Spoil Title"
            value={basics.title || "Basic Design Principles"}
          />

          <hr className="border-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="Category"
              value={basics.category || "UI/UX Design"}
            />
            <InfoItem label="Pricing" value={basics.pricing || "Paid"} />
          </div>

          <hr className="border-gray-200" />

          <InfoItem
            label="Institution"
            value={basics.institution || "Unknown Institution"}
          />

          <hr className="border-gray-200" />

          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="Course Code"
              value={basics.courseCode || "CHM204"}
            />
            <InfoItem
              label="Amount"
              value={
                basics.amount
                  ? `N${Number(basics.amount).toLocaleString()}`
                  : "Free"
              }
            />
          </div>

          <hr className="border-gray-200" />

          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="Expiry Date"
              value={basics.expiryDate || "20-05-2025"}
            />
            <InfoItem label="Modules" value={basics.moduleCount || "10"} />
          </div>

          <hr className="border-gray-200" />

          <InfoItem label="Lessons" value={basics.lessonCount || "10"} />

          <hr className="border-gray-200" />

          <InfoItem
            label="Description"
            value={
              basics.description ||
              "Understanding Design Principles is a comprehensive Spoil that takes you through the foundational concepts of creating effective and visually appealing designs."
            }
          />

          <hr className="border-gray-200" />

          <InfoItem
            label="What Will They Learn"
            value={
              basics.learningOutcome ||
              "Understanding Design Principles is a comprehensive Spoil that takes you through the foundational concepts of creating effective and visually appealing designs."
            }
          />

          <hr className="border-gray-200" />
        </div>
      </div>
    </section>
  );
};

export default SpoilBasicsSection;
