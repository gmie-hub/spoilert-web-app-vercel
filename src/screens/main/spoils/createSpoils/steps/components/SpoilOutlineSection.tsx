import { FC } from "react";

import Image from "next/image";

import DropdownIcon from "@spt/assets/icons/arrow-down.svg";
import EditIcon from "@spt/assets/icons/white-edit.svg";

import type { OutlineData } from "../../types";

interface SpoilOutlineSectionProps {
  outline: OutlineData;
  onEdit?: () => void;
}

const SpoilOutlineSection: FC<SpoilOutlineSectionProps> = ({
  outline,
  onEdit,
}) => {
  return (
    <section className="flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between bg-[#E6F4F7] px-3 py-2 rounded-xl">
        <h3 className="font-semibold text-blue text-lg">Spoil Outline</h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-xl bg-blue px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-opacity-90"
        >
          <Image src={EditIcon} alt="edit" width={20} height={20} /> Edit
        </button>
      </div>

      <div className="space-y-4">
        {outline.modules.map((module, index) => (
          <div
            key={module.id}
            className="flex items-center justify-between rounded-xl border border-gray-100 p-5 transition-colors hover:bg-gray-50"
          >
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-400">
                Module {index + 1}
              </p>

              <h4 className="font-semibold text-gray-900">{module.title}</h4>
            </div>

            <Image
              src={DropdownIcon}
              alt="dropdown"
              width={16}
              height={16}
              className="text-gray-400"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpoilOutlineSection;
