

// "use client";

// import type { FC } from "react";
// import { useEffect, useRef, useState } from "react";

// import { useField } from "formik";

// interface SelectOption {
//   value: string;
//   label: string;
// }

// interface CustomSelectProps {
//   name: string;
//   label: string;
//   placeholder?: string;
//   options: SelectOption[];
//   hasAsterisk?: boolean;
//   disabled?: boolean;
//   searchable?: boolean;
//   onSearchChange?: (value: string) => void;
//   filterOnFrontend?: boolean;
//   debounceTime?: number;
//   isLoading?: boolean; // optional: indicate if endpoint is loading
// }

// const Select: FC<CustomSelectProps> = ({
//   name,
//   label,
//   placeholder = "Select option",
//   options,
//   hasAsterisk = false,
//   disabled = false,
//   searchable = false,
//   onSearchChange,
//   filterOnFrontend = true,
//   debounceTime = 400,
//   isLoading = false,
// }) => {
//   const [field, meta, helpers] = useField(name);
//   const hasError = Boolean(meta.touched && meta.error);

//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");

//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const searchInputRef = useRef<HTMLInputElement>(null);

//   const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   /** Close dropdown when clicking outside */
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /** Focus input when dropdown opens or options update */
//   useEffect(() => {
//     if (open && searchable && searchInputRef.current) {
//       searchInputRef.current.focus({ preventScroll: true });
//     }
//   }, [open, searchable, options]); // ✅ also depend on options

//   /** Handle search input changes with debounce */
//   const handleSearchChange = (value: string) => {
//     setSearch(value);

//     if (!filterOnFrontend && onSearchChange) {
//       if (debounceTimer.current) clearTimeout(debounceTimer.current);

//       debounceTimer.current = setTimeout(() => {
//         onSearchChange(value);
//       }, debounceTime);
//     }
//   };

//   /** Filter options only if filterOnFrontend is true */
//   const displayedOptions = filterOnFrontend
//     ? options.filter((option) =>
//         option.label.toLowerCase().includes(search.toLowerCase()),
//       )
//     : options;

//   const selectedOption = options.find((opt) => opt.value === field.value);

//   return (
//     <div className="flex flex-col gap-1" ref={dropdownRef}>
//       {/* Label */}
//       <label htmlFor={name} className="text-sm font-medium text-gray-700">
//         {label}
//         {hasAsterisk && <span className="ml-1 text-red-500">*</span>}
//       </label>

//       {/* Select Box */}
//       <div className="relative">
//         <div
//           onClick={() => !disabled && setOpen(!open)}
//           className={`
//             h-12 w-full flex items-center justify-between
//             rounded-lg border bg-[#FBFBFB] px-3 pr-12 text-sm
//             cursor-pointer
//             focus:outline-none focus:ring-2 focus:ring-teal-500
//             ${disabled ? "cursor-not-allowed bg-gray-100 opacity-70" : ""}
//             ${hasError ? "border-red-500 focus:ring-red-400" : "border-gray-200"}
//           `}
//         >
//           <span className="text-gray-700">
//             {selectedOption ? selectedOption.label : placeholder}
//           </span>

//           {/* Dropdown Icon */}
//           <span className="absolute right-3 text-sm text-gray-400">▼</span>
//         </div>

//         {/* Dropdown */}
//         {open && !disabled && (
//           <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-md max-h-60 overflow-auto">
//             {/* Search Input */}
//             {searchable && (
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search..."
//                 value={search}
//                 onChange={(e) => handleSearchChange(e.target.value)}
//                 className="w-full px-3 py-2 text-sm border-b outline-none"
//               />
//             )}

//             {/* Loading State */}
//             {isLoading && (
//               <p className="px-3 py-2 text-sm text-gray-500">Loading...</p>
//             )}

//             {/* Options */}
//             {!isLoading && displayedOptions.length > 0
//               ? displayedOptions.map((option) => (
//                   <div
//                     key={option.value}
//                     onClick={() => {
//                       helpers.setValue(option.value);
//                       setOpen(false);
//                       setSearch(""); // reset search
//                     }}
//                     className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
//                   >
//                     {option.label}
//                   </div>
//                 ))
//               : !isLoading && (
//                   <p className="px-3 py-2 text-sm text-gray-400">
//                     No result found
//                   </p>
//                 )}
//           </div>
//         )}
//       </div>

//       {/* Error */}
//       {hasError && <span className="text-xs text-red-500">{meta.error}</span>}
//     </div>
//   );
// };

// export default Select;
"use client";

import type { FC } from "react";

import { useEffect, useRef, useState } from "react";
import { useField } from "formik";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  hasAsterisk?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  onSearchChange?: (value: string) => void;
  onChange?: (value: string) => void;  // ✅ add this
  filterOnFrontend?: boolean;
  debounceTime?: number;
  isLoading?: boolean;
}

const Select: FC<CustomSelectProps> = ({
  name,
  label,
  placeholder = "Select option",
  options,
  hasAsterisk = false,
  disabled = false,
  searchable = false,
  onSearchChange,
  onChange,  // ✅ add this
  filterOnFrontend = true,
  debounceTime = 400,
  isLoading = false,
}) => {
  const [field, meta, helpers] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      searchInputRef.current.focus({ preventScroll: true });
    }
  }, [open, searchable, options]);

  const handleSearchChange = (value: string) => {
    setSearch(value);

    if (!filterOnFrontend && onSearchChange) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        onSearchChange(value);
      }, debounceTime);
    }
  };

  const displayedOptions = filterOnFrontend
    ? options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  const selectedOption = options.find((opt) => opt.value === field.value);

  return (
    <div className="flex flex-col gap-1" ref={dropdownRef}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {hasAsterisk && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        <div
          onClick={() => !disabled && setOpen(!open)}
          className={`
            h-12 w-full flex items-center justify-between
            rounded-lg border bg-[#FBFBFB] px-3 pr-12 text-sm
            cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-teal-500
            ${disabled ? "cursor-not-allowed bg-gray-100 opacity-70" : ""}
            ${hasError ? "border-red-500 focus:ring-red-400" : "border-gray-200"}
          `}
        >
          <span className="text-gray-700">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="absolute right-3 text-sm text-gray-400">▼</span>
        </div>

        {open && !disabled && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-md max-h-60 overflow-auto">
            {searchable && (
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border-b outline-none"
              />
            )}

            {isLoading && (
              <p className="px-3 py-2 text-sm text-gray-500">Loading...</p>
            )}

            {!isLoading && displayedOptions.length > 0
              ? displayedOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      helpers.setValue(option.value);
                      onChange?.(option.value); // ✅ call onChange
                      setOpen(false);
                      setSearch("");
                    }}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  >
                    {option.label}
                  </div>
                ))
              : !isLoading && (
                  <p className="px-3 py-2 text-sm text-gray-400">
                    No result found
                  </p>
                )}
          </div>
        )}
      </div>

      {hasError && <span className="text-xs text-red-500">{meta.error}</span>}
    </div>
  );
};

export default Select;
