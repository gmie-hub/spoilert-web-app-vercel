"use client";

interface CommunityTabsProps<T extends string> {
  tabs: Array<{ label: string; value: T }>;
  value: T;
  onChange: (value: T) => void;
  variant?: "underline" | "pill";
}

const CommunityTabs = <T extends string>({
  tabs,
  value,
  onChange,
  variant = "underline",
}: CommunityTabsProps<T>) => {
  if (variant === "pill") {
    return (
      <div className="inline-flex rounded-xl bg-[#DDF1F8] p-2">
        {tabs?.map((tab) => {
          const isActive = tab.value === value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange(tab.value)}
              className={`min-w-[140px] rounded-lg text-sm px-4 py-3 font-medium transition ${
                isActive
                  ? "bg-[#0B5368] text-white shadow-sm"
                  : "text-[#5A6772] hover:text-[#0B5368]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex w-full gap-12 border-b border-[#E8EDF0]">
      {tabs?.map((tab) => {
        const isActive = tab?.value === value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab?.value)}
            className={`border-b-2 px-2 py-1 text-lg font-medium transition ${
              isActive
                ? "border-[#0B5368] text-[#0B5368]"
                : "border-transparent text-[#66727D] hover:text-[#0B5368]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default CommunityTabs;
