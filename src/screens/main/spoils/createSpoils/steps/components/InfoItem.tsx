import { FC } from "react";

interface InfoItemProps {
  label: string;
  value: any;
}

const InfoItem: FC<InfoItemProps> = ({ label, value }) => (
  <div>
    <dt className="text-sm tracking-wider text-gray-light">{label}</dt>
    <dd className="mt-1 text-lg font-medium text-black">{value}</dd>
  </div>
);

export default InfoItem;
