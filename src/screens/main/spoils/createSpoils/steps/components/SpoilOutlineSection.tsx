import { FC, useState } from "react";

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
  const [openModules, setOpenModules] = useState<Set<string | number>>(new Set());

  const toggleModule = (id: string | number) => {
    const next = new Set(openModules);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenModules(next);
  };

  return (
    <section className="flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between bg-[#E6F4F7] px-3 py-2 rounded-xl">
        <h3 className="font-semibold text-blue text-lg">Spoylz Outline</h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-xl bg-blue px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-opacity-90"
        >
          <Image src={EditIcon} alt="edit" width={20} height={20} /> Edit
        </button>
      </div>

      <div className="space-y-4">
        {outline?.modules?.map((module, index) => {
          const isOpen = openModules.has(module.id);
          return (
            <div key={module.id} className="rounded-xl border border-gray-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className={`w-full flex items-center justify-between p-5 transition-colors hover:bg-gray-50 ${isOpen ? "bg-gray-50" : "bg-white"}`}
                aria-expanded={isOpen}
              >
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase text-gray-400">Module {index + 1}</p>
                  <h4 className="font-semibold text-gray-900">{module.title}</h4>
                </div>

                <Image
                  src={DropdownIcon}
                  alt={isOpen ? "collapse" : "expand"}
                  width={16}
                  height={16}
                  className={`text-gray-400 transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 bg-white px-5 py-3">
                  {module.lessons && module.lessons.length > 0 ? (
                    <ol className="flex flex-col gap-3">
                      {module.lessons.map((lesson, li) => (
                        <li key={lesson.id} className="rounded-md border border-gray-100 p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-400">Lesson {li + 1}</p>
                              <p className="font-medium text-gray-900">{lesson.title}</p>
                            </div>
                            <div className="text-xs text-gray-500 capitalize">{lesson.type}</div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-gray-500">No lessons added for this module.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SpoilOutlineSection;
