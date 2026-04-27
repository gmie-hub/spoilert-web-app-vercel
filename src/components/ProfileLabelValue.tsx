import React from "react";

interface ProfileLabelValueProps {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  labelClassName?: string;
  containerClassName?: string;
}

const ProfileLabelValue: React.FC<ProfileLabelValueProps> = ({
  label,
  value,
  valueClassName = "text-[16px] font-medium text-[#212529]",
  labelClassName = "text-[14px] text-[#666869] mb-2",
  containerClassName = "",
}) => (
  <div className={containerClassName}>
    <p className={labelClassName}>{label}</p>
    <p className={valueClassName}>{value}</p>
  </div>
);

export default ProfileLabelValue;
