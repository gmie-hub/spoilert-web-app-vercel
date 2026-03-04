import React from "react";

export default function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
) {
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler]);
}
