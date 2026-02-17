// "use client";

// import type { FC, ReactNode } from "react";

// import { FiX } from "react-icons/fi";

// interface ModalProps {
//   open: boolean;
//   title?: string;
//   description?: string;
//   onClose: () => void;
//   children: ReactNode;
//   actions?: ReactNode;
//   size?: "sm" | "md" | "lg";
//   showCloseButton?: boolean; // NEW
// }

// const sizeMap: Record<NonNullable<ModalProps["size"]>, string> = {
//   sm: "max-w-md",
//   md: "max-w-lg",
//   lg: "max-w-2xl",
// };

// const Modal: FC<ModalProps> = ({
//   open,
//   title,
//   description,
//   onClose,
//   children,
//   actions,
//   size = "md",
// }) => {
//   if (!open) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
//       <div
//         className={`w-full rounded-2xl bg-white p-6 shadow-2xl ${sizeMap[size]}`}
//         role="dialog"
//         aria-modal="true"
//         aria-label={title}
//       >
//         <div className="flex items-start justify-between gap-6">
//           <div>
//             {title && (
//               <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//             )}
//             {description && (
//               <p className="mt-1 text-sm text-gray-500">{description}</p>
//             )}
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//             aria-label="Close modal"
//           >
//             <FiX className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="mt-6 space-y-4 text-sm text-gray-600">{children}</div>

//         {actions && (
//           <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
//             {actions}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Modal;

"use client";

import type { FC, ReactNode } from "react";

import { FiX } from "react-icons/fi";

interface ModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
  size?: "sm" | "md" | "lg";
  showCloseButton?: boolean; // new prop
}

const sizeMap: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const Modal: FC<ModalProps> = ({
  open,
  title,
  description,
  onClose,
  children,
  actions,
  size = "md",
  showCloseButton = true, // default true
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div
        className={`w-full rounded-2xl bg-white p-6 shadow-2xl ${sizeMap[size]}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        // Stop clicks on modal from closing (since background is not clickable)
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close modal"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="mt-6 space-y-4 text-sm text-gray-600">{children}</div>

        {/* Actions */}
        {actions && (
          <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
