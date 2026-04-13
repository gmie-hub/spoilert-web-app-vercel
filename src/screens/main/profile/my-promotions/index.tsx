"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";


const promotions = {
  active: [
    {
      image: "/assets/images/sample-course.jpg",
      institution: "University of Lagos",
      title: "Frontend Development For Beginners",
      price: "₦15,000",
      tag: "UI/UX Design",
      plan: { label: "Standard (14 days)", color: "#F9C97B" },
      timeLeft: "12d:4h:50m:10s left",
    },
    {
      image: "/assets/images/sample-course2.jpg",
      institution: "",
      title: "Financial Literacy",
      price: "₦80,000",
      tag: "UI/UX Design",
      plan: { label: "Premium (30 days)", color: "#1CC8A5" },
      timeLeft: "9d:3h:10m:10s left",
    },
    {
      image: "/assets/images/sample-course.jpg",
      institution: "University of Lagos",
      title: "Frontend Development For Beginners",
      price: "₦15,000",
      tag: "UI/UX Design",
      plan: { label: "Basic (7 days)", color: "#F9C97B" },
      timeLeft: "2d:4h:50m:10s left",
    },
    {
      image: "/assets/images/sample-course.jpg",
      institution: "University of Lagos",
      title: "Frontend Development For Beginners",
      price: "₦15,000",
      tag: "UI/UX Design",
      plan: { label: "Standard (14 days)", color: "#F9C97B" },
      timeLeft: "12d:4h:50m:10s left",
    },
  ],
  expired: [
    {
      image: "/assets/images/sample-course3.jpg",
      institution: "",
      title: "BCH 404- Pharmaceutical Biochemistry",
      price: "₦125,000",
      tag: "UI/UX Design",
      plan: { label: "Basic (7 days)", color: "#F9C97B" },
      timeLeft: "1d:3h:20m:40s left",
    },
    {
      image: "/assets/images/sample-course4.jpg",
      institution: "University of Lagos",
      title: "Branding and Analytics",
      price: "₦100,000",
      tag: "UI/UX Design",
      plan: { label: "Standard (14 days)", color: "#F9C97B" },
      timeLeft: "6d:4h:20m:20s left",
    },
    {
      image: "/assets/images/sample-course.jpg",
      institution: "University of Lagos",
      title: "Frontend Development For Beginners",
      price: "₦15,000",
      tag: "UI/UX Design",
      plan: { label: "Premium (30 days)", color: "#1CC8A5" },
      timeLeft: "8d:4h:50m:10s left",
    },
    {
      image: "/assets/images/sample-course.jpg",
      institution: "University of Lagos",
      title: "Frontend Development For Beginners",
      price: "₦15,000",
      tag: "UI/UX Design",
      plan: { label: "Basic (7 days)", color: "#F9C97B" },
      timeLeft: "4d:4h:50m:10s left",
    },
  ],
};

function PromotionCard({ image, institution, title, price, tag, plan, timeLeft }: any) {
  return (
    <div className="flex bg-white rounded-2xl shadow-sm p-4 gap-4 items-center min-h-[120px] relative group hover:shadow-md transition border border-[#F6F4F0]">
      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={title}
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1 min-w-0">
        {institution && <div className="text-xs text-[#8A98A3] font-medium mb-1">{institution}</div>}
        <div className="font-semibold text-base text-[#20262D] truncate pr-2 leading-snug">{title}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#20262D] font-bold text-base">{price}</span>
          <span className="bg-[#E6F4F7] text-[#003049] text-xs font-medium rounded px-2 py-0.5">{tag}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs font-medium rounded px-2 py-0.5" style={{ background: plan.color + '20', color: plan.color }}>{plan.label}</span>
          <span className="text-xs text-[#8A98A3]">{timeLeft}</span>
        </div>
      </div>
    </div>
  );
}

export default function MyPromotionsPage() {
  const [tab, setTab] = useState<'active' | 'expired'>('active');
  const router = useRouter();
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-6 text-[#20262D]">My Promotions</h2>
      <div className="flex gap-0 border-b border-[#E9EEF2] mb-6 relative w-full max-w-5xl mx-auto">
        <button
          className={`flex-1 pb-2 text-xl font-semibold transition border-b-4 ${tab === 'active' ? 'border-[#003049] text-[#003049]' : 'border-transparent text-[#8A98A3]'}`}
          onClick={() => setTab('active')}
        >
          Active
        </button>
        <button
          className={`flex-1 pb-2 text-xl font-semibold transition border-b-4 ${tab === 'expired' ? 'border-[#003049] text-[#003049]' : 'border-transparent text-[#8A98A3]'}`}
          onClick={() => setTab('expired')}
        >
          Expired
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions[tab].map((promo, idx) => (
          <div key={idx} onClick={() => router.push("/profile/my-promotions/details")} className="cursor-pointer">
            <PromotionCard {...promo} />
          </div>
        ))}
      </div>
    </div>
  );
}
