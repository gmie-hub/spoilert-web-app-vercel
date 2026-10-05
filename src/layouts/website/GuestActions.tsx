import React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import Button from "@spt/components/button";

/** Header actions shown to logged-out visitors on md+ screens. */
const GuestActions = () => {
  const router = useRouter();
  const pathname = usePathname();
  // Already in the institution apply/login flow — the link would be redundant.
  const isInstitutionFlow = pathname?.startsWith("/institution");

  return (
    <div className="hidden md:flex items-center gap-2 lg:gap-4">
      {!isInstitutionFlow && (
        <Link
          href="/institution/login"
          className="whitespace-nowrap text-sm font-semibold text-blue underline underline-offset-4 hover:text-blue/80"
        >
          {/* Short label on md where the row is tight */}
          <span className="lg:hidden">Institution Login</span>
          <span className="hidden lg:inline">Apply / Login as an Institution</span>
        </Link>
      )}

      <Button
        variant="outline"
        className="rounded-full px-4 md:px-6 lg:px-8 xl:px-14 text-sm"
        onClick={() => router.push("/auth/signin")}
      >
        Login
      </Button>

      <Button
        variant="default"
        className="rounded-full px-4 md:px-5 lg:px-6 text-sm whitespace-nowrap"
        onClick={() => router.push("/auth/signup")}
      >
        <span className="hidden sm:inline">Sign Up For Free</span>
        <span className="sm:hidden">Sign Up</span>
      </Button>
    </div>
  );
};

export default GuestActions;
