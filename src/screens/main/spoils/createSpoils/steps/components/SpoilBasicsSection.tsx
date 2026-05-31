import { FC, useEffect, useMemo, useState } from "react";

import Image from "next/image";

import CameraIcon from "@spt/assets/icons/camera.svg";
import EditIcon from "@spt/assets/icons/white-edit.svg";

import InfoItem from "./InfoItem";

import type { BasicsFormData, SpoilTypeOption } from "../../types";

interface SpoilBasicsSectionProps {
  basics?: BasicsFormData;
  onEdit?: () => void;
  selectedType?: SpoilTypeOption;
}

const SpoilBasicsSection: FC<SpoilBasicsSectionProps> = ({
  basics,
  onEdit,
  selectedType,
}) => {
  const [blobPreview, setBlobPreview] = useState<string | null>(null);
  const coverImage = basics?.coverImage;

  useEffect(() => {
    // when coverImage is a File, create a blob URL and clean up
    if (coverImage instanceof File) {
      const url = URL.createObjectURL(coverImage);
      setBlobPreview(url);
      return () => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Failed to fetch cover image URL
        }
        setBlobPreview(null);
      };
    }

    // clear blobPreview for other shapes
    setBlobPreview(null);
    return undefined;
  }, [coverImage]);

  const previewUrl = useMemo(() => {
    if (!basics || !basics.coverImage) return null;
    if (basics.coverImage instanceof File) return blobPreview;
    if (typeof basics.coverImage === "string") return basics.coverImage;
    if (
      typeof basics.coverImage === "object" &&
      (basics.coverImage as any).dataUrl
    )
      return (basics.coverImage as any).dataUrl;
    return null;
  }, [basics, blobPreview]);
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
            {previewUrl ? (
              // use native <img> for blob/data URLs, next/image for remote URLs
              previewUrl.startsWith("blob:") ||
              previewUrl.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Cover"
                  className="h-16 w-16 object-cover"
                />
              ) : (
                <Image
                  width={64}
                  height={64}
                  src={previewUrl}
                  alt="Cover"
                  className="object-cover"
                />
              )
            ) : (
              <div className="flex items-center justify-center text-gray-400">
                <Image
                  src={CameraIcon}
                  alt="cover placeholder"
                  width={64}
                  height={64}
                />
              </div>
            )}
          </div>

          {/* <button className="font-medium text-blue hover:underline">
            Change Cover Image
          </button> */}
        </div>

        {/* Basic Info Grid */}
        <div className="flex flex-col gap-4">
          <InfoItem label="Spoylz Title" value={basics?.title || "n/a"} />

          <hr className="border-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Category" value={basics?.category || "n/a"} />
            <InfoItem label="Pricing" value={basics?.pricing || "NA"} />
          </div>

          <hr className="border-gray-200" />

          <InfoItem label="Institution" value={basics?.institution || "n/a"} />

          <hr className="border-gray-200" />

          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Course Code" value={basics?.courseCode || "n/a"} />
            <InfoItem
              label="Amount"
              value={
                basics?.amount
                  ? `N${Number(basics.amount).toLocaleString()}`
                  : "N/A"
              }
            />
          </div>

          <hr className="border-gray-200" />

          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Expiry Date" value={basics?.expiryDate || "n/a"} />
            {selectedType !== "simple" && (
              <InfoItem label="Modules" value={basics?.moduleCount || "10"} />
            )}
          </div>

          <hr className="border-gray-200" />

          {selectedType !== "simple" && (
            <InfoItem label="Lessons" value={basics?.lessonCount || "10"} />
          )}

          <hr className="border-gray-200" />

          <InfoItem label="Description" value={basics?.description || "n/a"} />

          <hr className="border-gray-200" />

          <InfoItem
            label="What Will They Learn"
            value={basics?.learningOutcome || "N/A"}
          />

          {selectedType === "simple" && (
            <>
              <hr className="border-gray-200" />
              <InfoItem
                label="Spoylz Content"
                value={
                  basics?.lessonType === "text"
                    ? (basics?.lessonContent ?? "n/a")
                    : basics?.lessonFile && (basics.lessonFile as any).name
                      ? (basics.lessonFile as any).name
                      : "Uploaded File"
                }
              />
            </>
          )}

          <hr className="border-gray-200" />
        </div>
      </div>
    </section>
  );
};

export default SpoilBasicsSection;
