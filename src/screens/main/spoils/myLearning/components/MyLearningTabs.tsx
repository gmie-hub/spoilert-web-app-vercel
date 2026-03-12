import type { MyLearningTabKey } from "../types";

interface MyLearningTabsProps {
  activeTab: MyLearningTabKey;
  onChange: (tab: MyLearningTabKey) => void;
}

const tabs: Array<{ key: MyLearningTabKey; label: string }> = [
  { key: "ongoing", label: "Ongoing" },
  { key: "completed", label: "Completed" },
];

export const MyLearningTabs = ({
  activeTab,
  onChange,
}: MyLearningTabsProps) => (
  <div className="grid grid-cols-2 border-b border-[#E6E8EC]">
    {tabs.map((tab) => {
      const isActive = tab.key === activeTab;

      return (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`border-b-2 px-4 py-4 transition-colors ${
            isActive
              ? "border-[#0B5368] text-blue font-semibold"
              : "border-transparent text-[#010137] hover:text-[#0B5368]"
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

export default MyLearningTabs;