"use client";

import { useState } from "react";

import { FiEdit2 } from "react-icons/fi";

import Button from "@spt/components/button";
import { useAuthStore } from "@spt/store/authStore";

import EditProfileForm from "./EditProfileForm";

const ProfileDetailsSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = useAuthStore((state) => state.user);

  const profileData = {
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    username: user?.username || "",
    email: user?.email || "",
    countryCode: user?.country_code ? 
      (user.country_code.startsWith("+") ? user.country_code : `+${user.country_code}`) : "+234",
    phoneNumber: user?.phone_number || "",
    bio: user?.profile?.bio || "",
    expertise: user?.profile?.expertise || [],
  };

  if (isEditing) {
    return (
      <EditProfileForm
        initialData={profileData}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#20262D]">Profile Details</h2>
        <Button
          variant="darkBlue"
          iconLeft={<FiEdit2 size={16} />}
          onClick={() => setIsEditing(true)}
          className="!py-2 !px-4 !text-sm"
        >
          Edit Profile
        </Button>
      </div>

      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">First Name</p>
            <p className="text-sm font-medium text-[#20262D]">
              {profileData.firstName || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Last Name</p>
            <p className="text-sm font-medium text-[#20262D]">
              {profileData.lastName || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Username</p>
            <p className="text-sm font-medium text-[#20262D]">
              {profileData.username || "—"}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-500 mb-1">Email Address</p>
          <p className="text-sm font-medium text-[#20262D]">
            {profileData.email || "—"}
          </p>
        </div>
      </div>

      {/* Tutor Information Section */}
      <div className="border-t border-gray-100 pt-6 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Tutor Information
        </h3>

        <div>
          <p className="text-xs text-gray-500 mb-1">Phone Number</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
              {profileData.countryCode}
            </span>
            <p className="text-sm font-medium text-[#20262D]">
              {profileData.phoneNumber || "—"}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-500 mb-1">Bio</p>
          <p className="text-sm text-[#20262D] leading-relaxed">
            {profileData.bio || "No bio added yet."}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-500 mb-1">Expertise</p>
          <p className="text-sm font-medium text-[#20262D]">
            {profileData.expertise?.length > 0 
              ? profileData.expertise.join(", ") 
              : "No expertise added yet."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsSection;
