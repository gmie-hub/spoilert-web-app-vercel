"use client";

import { forwardRef } from "react";

import { useField } from "formik";
import ReCAPTCHA from "react-google-recaptcha";

interface Props {
  /** Formik field name. Defaults to "recaptcha". */
  name?: string;
}

/**
 * Google reCAPTCHA v2 (checkbox) wired into Formik.
 *
 * Stores the token in the Formik field `name`. The parent can keep a ref to
 * the underlying widget so it can call `.reset()` after a submit attempt
 * (reCAPTCHA tokens are single-use).
 */
const RecaptchaField = forwardRef<ReCAPTCHA, Props>(
  ({ name = "recaptcha" }, ref) => {
    const [, meta, helpers] = useField(name);
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const hasError = meta.touched && Boolean(meta.error);

    if (!siteKey) {
      return (
        <p className="text-xs text-red-500">
          reCAPTCHA is not configured (missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY).
        </p>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        <ReCAPTCHA
          ref={ref}
          sitekey={siteKey}
          onChange={(token) => {
            helpers.setValue(token ?? "");
            helpers.setTouched(true);
          }}
          onExpired={() => helpers.setValue("")}
          onErrored={() => helpers.setValue("")}
        />
        {hasError && <p className="text-xs text-red-500">{meta.error}</p>}
      </div>
    );
  },
);

RecaptchaField.displayName = "RecaptchaField";

export default RecaptchaField;
