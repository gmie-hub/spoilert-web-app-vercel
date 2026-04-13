"use client";

import React from "react";

import Image from "next/image";

import PromotionMetrics from "./PromotionMetrics";

export default function PromotionDetailsModal({ open, onClose, promo }: { open: boolean; onClose: () => void; promo: any }) {
  const [tab, setTab] = React.useState<'overview' | 'metrics'>('overview');
  if (!open || !promo) return null;
  return (
    <div >
      <div >
        <button onClick={onClose} className="absolute right-4 top-4 text-2xl text-[#003049] font-bold">×</button>
        <button onClick={onClose} className="absolute left-4 top-4 text-[#003049] text-base font-medium">&lt; Back</button>
        <h2 className="text-xl font-semibold mb-6 text-[#20262D] mt-2">Promotion Details</h2>
        <div className="flex gap-8 border-b border-[#E9EEF2] mb-6">
          <button className={`pb-2 text-lg font-semibold transition border-b-2 ${tab === 'overview' ? 'border-[#003049] text-[#003049] w-40' : 'border-transparent text-[#8A98A3] w-40'}`} onClick={() => setTab('overview')}>Overview</button>
          <button className={`pb-2 text-lg font-semibold transition border-b-2 ${tab === 'metrics' ? 'border-[#003049] text-[#003049] w-40' : 'border-transparent text-[#8A98A3] w-40'}`} onClick={() => setTab('metrics')}>Metrics</button>
        </div>
        {tab === 'overview' ? (
          <>
            <div className="flex items-center gap-4 mb-6">
              <Image src={promo.image} alt={promo.title} width={64} height={64} className="rounded-xl object-cover w-16 h-16" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <div className="text-[#8A98A3] text-sm">Spoil title</div>
                <div className="font-medium text-[#20262D]">{promo.title}</div>
              </div>
              <div>
                <div className="text-[#8A98A3] text-sm">Amount</div>
                <div className="font-medium text-[#20262D]">{promo.price}</div>
              </div>
              <div>
                <div className="text-[#8A98A3] text-sm">Category</div>
                <div className="font-medium text-[#20262D]">{promo.tag}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <div className="text-[#8A98A3] text-sm">Promotion Package</div>
                <div className="font-medium text-[#20262D]">{promo.plan.label}</div>
              </div>
              <div>
                <div className="text-[#8A98A3] text-sm">Promotion Amount</div>
                <div className="font-medium text-[#20262D]">N20,000</div>
              </div>
              <div>
                <div className="text-[#8A98A3] text-sm">Time Left</div>
                <div className="font-medium text-[#20262D]">{promo.timeLeft}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <div className="text-[#8A98A3] text-sm">Start Date</div>
                <div className="font-medium text-[#20262D]">21-08-2025</div>
              </div>
              <div>
                <div className="text-[#8A98A3] text-sm">End Date</div>
                <div className="font-medium text-[#20262D]">28-08-2025</div>
              </div>
              <div>
                <div className="text-[#8A98A3] text-sm">Status</div>
                <span className="bg-[#E6FAF7] text-[#1CC8A5] text-sm font-medium rounded px-4 py-1 inline-block">Active</span>
              </div>
            </div>
          </>
        ) : (
          <PromotionMetrics />
        )}
      </div>
    </div>
  );
}
