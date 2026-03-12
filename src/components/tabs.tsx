"use client";

import { ReactNode, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs = ({ tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex w-full flex-col">
      {/* <div className="flex w-fit border-b border-gray-200 cursor-pointer">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`w-fit px-4 py-2 cursor-pointer text-sm font-medium transition-colors duration-200 ${
              activeTab === index
                ? "border-b-2 border-blue text-blue"
                : "text-gray hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div> */}
      <div className="flex justify-start w-full border-b border-gray-200 cursor-pointer">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium text-center transition-colors duration-200 ${
              activeTab === index
                ? "border-b-2 border-blue text-blue"
                : "text-gray hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {tabs[activeTab].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs;
