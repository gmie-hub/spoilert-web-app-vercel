"use client";

import { ReactNode, useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs = ({ tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // Read saved active tab on mount (and when `tabs` changes) to avoid
  // server/client hydration mismatch by initializing to 0 on the server.
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const key = `tabs-active:${window.location.pathname}:${tabs.map((t) => t.label).join("|")}`;
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const idx = tabs.findIndex((t) => t.label === raw);
        if (idx >= 0 && idx < tabs.length) setActiveTab(idx);
      }
    } catch  {
      // ignore read errors (e.g., storage blocked)
    }
  }, [tabs]);

  // Persist active tab when it changes.
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const key = `tabs-active:${window.location.pathname}:${tabs.map((t) => t.label).join("|")}`;
      const label = tabs[activeTab]?.label ?? tabs[0]?.label;
      if (label) localStorage.setItem(key, label);
    } catch {
      // ignore write errors
    }
  }, [activeTab, tabs]);

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
