"use client";
import { useState } from "react";
import React from "react";

import { FiEye, FiEyeOff } from "react-icons/fi";

import PasswordSuccessModal from "./PasswordSuccessModal";

function PasswordInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-2 flex-1 min-w-[220px]">
      <label className="font-medium text-[#20262D] text-base mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[#E9EEF2] bg-[#FAFAFA] px-4 py-3 text-base outline-none focus:border-[#003049] transition pr-10"
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A98A3]"
          onClick={() => setShow(s => !s)}
        >
          {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simulate success (replace with real logic)
    setShowSuccess(true);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold mb-6 text-[#20262D]">Change Password</h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <PasswordInput
              label="Current Password"
              value={current}
              onChange={setCurrent}
              placeholder="Enter your password"
            />
            <PasswordInput
              label="New Password"
              value={next}
              onChange={setNext}
              placeholder="Enter your password"
            />
          </div>
          <PasswordInput
            label="Confirm Password"
            value={confirm}
            onChange={setConfirm}
            placeholder="Re-enter your new password"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-10 bg-[#003949] hover:bg-[#003049] text-white font-semibold rounded-xl py-4 text-base transition"
        >
          Change Password
        </button>
      </form>
      <PasswordSuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}
