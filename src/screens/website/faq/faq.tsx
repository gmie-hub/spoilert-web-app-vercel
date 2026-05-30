"use client";

import { useState } from "react";

import Image from "next/image";

import PlusIcon from "@spt/assets/icons/plusopen.svg";
import CloseIcon from "@spt/assets/icons/xclose.svg";
import GetStarted from "@spt/components/getStarted";

const faqs = [
  {
    question: "What is a Spoylz on Spoilert?",
    answer:
      "A Spoylz is a learning experience or course shared by tutors to help learners grow.",
  },
  {
    question: "Who can become a tutor on Spoilert?",
    answer:
      "Anyone with expertise in a subject can become a tutor! Whether you're an academic, a professional, or a passionate hobbyist, you can create Spoylz and share your knowledge.",
  },
  {
    question: "How do learners access Spoylz?",
    answer:
      "Learners can browse Spoylz, enroll, and begin learning instantly through the platform.",
  },
  {
    question: "Can I sponsor a Spoylz for others?",
    answer:
      "Yes! You can sponsor Spoylz for friends, students, or anyone who needs support.",
  },
  {
    question: "Do Spoylz expire?",
    answer:
      "No, Spoylz remain available unless removed by the tutor or institution.",
  },
  {
    question: "How do tutors earn on Spoilert?",
    answer:
      "Tutors earn through paid Spoylz, sponsorships, and institutional partnerships.",
  },
  {
    question: "Is Spoilert available worldwide?",
    answer:
      "Yes, Spoilert is accessible globally for learners and tutors everywhere.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(1);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <section className="px-6 md:px-25 pt-4 lg:pt-24 bg-white">
        {/* Header Box */}
        <div className="bg-[#E9F8FD] rounded-2xl py-10 px-6 text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#083344]">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-600 mt-3 text-sm sm:text-base max-w-2xl mx-auto">
            Got questions? Whether you&apos;re a learner eager to explore new
            knowledge or a tutor ready to share your expertise, our FAQ section
            covers everything you need to get started on Spoilert.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-300 ${
                  isOpen
                    ? "bg-[#E9F8FD] border-[#BEEAF5]"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Question Row */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center px-5 py-5 text-left"
                >
                  <h3
                    className={`font-medium text-sm sm:text-base ${
                      isOpen ? "text-[#0F172A]" : "text-gray-800"
                    }`}
                  >
                    {index + 1}. {faq.question}
                  </h3>

                  {/* Icon */}
                  <span className="w-9 h-9 flex items-center justify-center rounded-lg border bg-white">
                    {isOpen ? (
                      <Image
                        src={CloseIcon}
                        alt="CloseIcon"
                        width={20}
                        height={20}
                      />
                    ) : (
                      <Image
                        src={PlusIcon}
                        alt="PlusIcon"
                        width={20}
                        height={20}
                      />
                    )}
                  </span>
                </button>

                {/* Answer */}
                {isOpen && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed max-w-3xl">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <GetStarted />
    </>
  );
}
