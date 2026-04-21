"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

import EditIcon from "@spt/assets/icons/edit-2profile.svg";
import Button from "@spt/components/button";
import ProfileLabelValue from "@spt/components/ProfileLabelValue";
import useProfileDetailsQuery from "@spt/hooks/apiRequests/useProfileDetailsQuery";

import EditProfileForm from "./EditProfileForm";

const ProfileDetailsSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useProfileDetailsQuery();
  const user = data?.data || {};
  const profileData = {
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    username: user?.username || "",
    email: user?.email || "",
    countryCode: user?.country_code
      ? user.country_code.startsWith("+")
        ? user.country_code
        : `+${user.country_code}`
      : "+234",
    phoneNumber: user?.phone_number || "",
    bio: user?.profile?.bio || "",
    expertise: user?.profile?.expertise || [],
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }
  if (isError) {
    return <div>Failed to load profile.</div>;
  }

  if (isEditing) {
    return (
      <EditProfileForm
        initialData={profileData}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => {
          setIsEditing(false);
          queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#212529]">
          Profile Details
        </h2>
        <Button
          variant="darkBlue"
          iconLeft={<Image src={EditIcon} alt="Edit" className="w-5 h-5" />}
          onClick={() => setIsEditing(true)}
          className="!py-2 !px-4 !text-sm"
        >
          Edit Profile
        </Button>
      </div>

      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-[16px] uppercase tracking-wider text-[#666869]">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfileLabelValue
            label="First Name"
            value={profileData.firstName || "—"}
          />
          <ProfileLabelValue
            label="Last Name"
            value={profileData.lastName || "—"}
          />
          <ProfileLabelValue
            label="Username"
            value={profileData.username || "—"}
          />
        </div>

        <ProfileLabelValue
          label="Email Address"
          value={profileData.email || "—"}
          containerClassName="border-t border-[#EFEFEF] pt-6"
        />
      </div>

      {/* Tutor Information Section */}
      <div className="border-t border-[#EFEFEF]  pt-6 space-y-4">
        <h3 className="text-[16px] uppercase tracking-wider text-[#666869]">
          Tutor Information
        </h3>

        <ProfileLabelValue
          label="Phone Number"
          value={
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                {profileData.countryCode}
              </span>
              {profileData.phoneNumber || "—"}
            </span>
          }
        />

        <ProfileLabelValue
          label="Bio"
          value={profileData.bio || "No bio added yet."}
          valueClassName="text-sm text-[#20262D] leading-relaxed"
          containerClassName="border-t border-[#EFEFEF] pt-6"
        />

        <ProfileLabelValue
          label="Expertise"
          value={
            profileData.expertise?.length > 0
              ? profileData.expertise.join(", ")
              : "No expertise added yet."
          }
          containerClassName="border-t border-gray-100 pt-4"
        />
      </div>
    </div>
  );
};

export default ProfileDetailsSection;
