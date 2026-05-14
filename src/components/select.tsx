"use client";

import { FC, useEffect, useRef, useState } from "react";

import { useField } from "formik";
import Image from "next/image";

import ArrowDownIcon from "@spt/assets/icons/arrow-down.svg";

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
  onChange?: (value: string) => void;
  filterOnFrontend?: boolean;
  debounceTime?: number;
  isLoading?: boolean;
  onReachEnd?: () => void;
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
  onChange,
  filterOnFrontend = true,
  debounceTime = 400,
  isLoading = false,
  onReachEnd,
}) => {
  const [field, meta, helpers] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el || isLoading || !onReachEnd) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      onReachEnd();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        if (search) {
          setSearch("");
          onSearchChange?.("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [search, onSearchChange]);

  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      searchInputRef.current.focus({ preventScroll: true });
    }
  }, [open, searchable, options]);

  const handleSearchChange = (value: string) => {
    setSearch(value);

    if (!filterOnFrontend && onSearchChange) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      // Fire immediately when clearing so the endpoint is recalled without delay
      if (!value) {
        onSearchChange("");
        return;
      }

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
          onClick={() => {
            if (!disabled) {
              if (open && search) {
                setSearch("");
                onSearchChange?.("");
              }
              setOpen(!open);
            }
          }}
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
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-md">
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

            <div ref={listRef} onScroll={handleScroll} className="max-h-52 overflow-auto">
              {/* Dropdown Icon */}
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                <Image
                  src={ArrowDownIcon}
                  alt="Dropdown arrow"
                  width={16}
                  height={16}
                />
              </span>

              {isLoading && (
                <p className="px-3 py-2 text-sm text-gray-500">Loading...</p>
              )}

              {!isLoading && displayedOptions.length > 0
                ? displayedOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        helpers.setValue(option.value);
                        onChange?.(option.value);
                        setOpen(false);
                        setSearch("");
                        onSearchChange?.("");
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
          </div>
        )}
      </div>

      {hasError && <span className="text-xs text-red-500">{meta.error}</span>}
    </div>
  );
};

export default Select;
