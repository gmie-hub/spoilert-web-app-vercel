import { NextResponse } from "next/server";

/**
 * Server-side reCAPTCHA verification.
 *
 * The browser sends the token produced by the reCAPTCHA widget, and we verify
 * it with Google using the SECRET key. The secret key must never be exposed to
 * the browser, which is why this runs in a server route handler (and why the
 * env var has no NEXT_PUBLIC_ prefix).
 */
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing reCAPTCHA token." },
        { status: 400 },
      );
    }

    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA secret key is not configured." },
        { status: 500 },
      );
    }

    const body = new URLSearchParams({ secret, response: token });

    const googleRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      },
    );

    const data = (await googleRes.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    if (!data.success) {
      return NextResponse.json(
        {
          success: false,
          message: "reCAPTCHA verification failed. Please try again.",
          errors: data["error-codes"],
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unexpected error verifying reCAPTCHA." },
      { status: 500 },
    );
  }
}
