import React from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@spt/store/authStore";

interface LogoutConfirmModalProps {
  open: boolean;
  onClose: () => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  open,
  onClose,
}) => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-11/12 mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Are you sure you want to logout?
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          You will be logged out of your account.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            onClick={() => {
              onClose();
              logout();
              router.push("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
