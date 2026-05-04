"use server";

import { redirect } from "next/navigation";

import { httpClient } from "@/src/lib/axious/httpClient";
import { setTokenInCookies } from "@/src/lib/tokenUtils";
import {
  getDefaultDashboardRoute,
  type UserRole,
} from "@/src/lib/authUtilis";
import { getFriendlyAuthErrorMessage } from "@/src/lib/authErrorMessages";

interface VerifyEmailResult {
  success: boolean;
  message: string;
  /** When true, caller should redirect to login. */
  loginInstead?: boolean;
}

const friendlyOtpMessage = (raw: unknown, fallback: string) => {
  const text = typeof raw === "string" ? raw.trim() : "";
  const lower = text.toLowerCase();
  if (!text) return fallback;
  if (/expired|expiry|timed?\s?out/.test(lower))
    return "This OTP has expired. Please request a new one.";
  if (/invalid|incorrect|wrong|mismatch|not match/.test(lower))
    return "The code you entered is incorrect. Please double-check and try again.";
  if (/too many|rate limit|limit reached|429/.test(lower))
    return "Too many attempts. Please wait a minute before trying again.";
  if (/not found|no otp|no record/.test(lower))
    return "We couldn't find an active OTP for this email. Please request a new one.";
  if (/already verified|already used|used/.test(lower))
    return "This code has already been used. Please request a new one if needed.";
  return text;
};

/**
 * Verify the OTP and, if the backend returns tokens, log the user in
 * automatically — no need for them to bounce back through /login.
 */
export const verifyEmailAction = async (payload: {
  email: string;
  otp: string;
}): Promise<VerifyEmailResult> => {
  try {
    const res = await httpClient.post<{
      accessToken?: string;
      refreshToken?: string;
      token?: string;
      user?: { role?: string };
    }>("/auth/verify-email", payload, {
      expectedStatuses: [400, 401, 403, 429],
    });

    const data = res?.data;
    if (data?.accessToken && data?.refreshToken) {
      await setTokenInCookies(
        "accessToken",
        data.accessToken,
        7 * 24 * 60 * 60,
      );
      await setTokenInCookies(
        "refreshToken",
        data.refreshToken,
        30 * 24 * 60 * 60,
      );
      if (data.token) {
        await setTokenInCookies(
          "better-auth.session_token",
          data.token,
          24 * 60 * 60,
        );
      }
      const role = (data.user?.role as UserRole) || ("CUSTOMER" as UserRole);
      redirect(getDefaultDashboardRoute(role));
    }

    // Backend returned 200 but no tokens — fall back to login.
    return {
      success: true,
      message: "Email verified successfully.",
      loginInstead: true,
    };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    const raw =
      (error as { response?: { data?: { message?: unknown } } })?.response
        ?.data?.message ??
      (error as { message?: unknown })?.message;
    return {
      success: false,
      message: friendlyOtpMessage(
        raw,
        getFriendlyAuthErrorMessage(error, "verifyOtp"),
      ),
    };
  }
};

/**
 * Resend OTP — try the most common backend route shapes silently so we
 * still succeed when one of them is unavailable.
 */
export const resendOtpAction = async (
  email: string,
): Promise<{ success: boolean; message: string }> => {
  const candidates: { path: string; body: Record<string, unknown> }[] = [
    { path: "/auth/resend-otp", body: { email } },
    { path: "/auth/resend-verification", body: { email } },
    {
      path: "/auth/send-otp",
      body: { email, purpose: "EMAIL_VERIFICATION" },
    },
    { path: "/auth/send-verification-otp", body: { email } },
  ];

  let lastMessage = "Couldn't send a new code right now. Please try again.";

  for (const c of candidates) {
    try {
      await httpClient.post<unknown>(c.path, c.body, {
        expectedStatuses: [400, 403, 404, 429],
      });
      return {
        success: true,
        message: "A new OTP has been sent to your email.",
      };
    } catch (error: unknown) {
      const status =
        (error as { response?: { status?: number } })?.response?.status ??
        (error as { status?: number })?.status;
      if (status === 404) continue; // try next path
      const raw =
        (error as { response?: { data?: { message?: unknown } } })?.response
          ?.data?.message ??
        (error as { message?: unknown })?.message;
      lastMessage = friendlyOtpMessage(raw, lastMessage);
    }
  }

  return { success: false, message: lastMessage };
};
