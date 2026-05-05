"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Shield, Store, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { loginAction } from "@/src/app/(commonLayout)/(authRouteGroup)/login/_action";
import {
  adminDemoLoginAction,
  customerDemoLoginAction,
  sellerDemoLoginAction,
} from "@/src/app/(commonLayout)/(authRouteGroup)/login/_action";
import { loginZodSchema } from "@/src/zod/auth.validation";
import { getFriendlyAuthErrorMessage } from "@/src/lib/authErrorMessages";

interface Props {
  redirectPath?: string;
  initialEmail?: string;
  verifiedFlag?: boolean;
}

const DEMO_ACCOUNTS: {
  role: "admin" | "seller" | "customer";
  label: string;
  action: (redirectPath?: string) => Promise<unknown>;
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
}[] = [
  {
    role: "admin",
    label: "Admin",
    action: adminDemoLoginAction,
    icon: Shield,
    tint: "from-[#281C59] to-[#4E8D9C]",
  },
  {
    role: "seller",
    label: "Seller",
    action: sellerDemoLoginAction,
    icon: Store,
    tint: "from-[#4E8D9C] to-[#85C79A]",
  },
  {
    role: "customer",
    label: "Customer",
    action: customerDemoLoginAction,
    icon: ShoppingBag,
    tint: "from-[#6FB6CC] to-[#4E8D9C]",
  },
];

export default function NexoraLoginForm({ redirectPath, initialEmail, verifiedFlag }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement | null>(null);

  // 🎉 If we're arriving from the verify-email page, surface a one-shot toast
  // and prefill the email so the user only types their password once.
  const verifiedShownRef = useRef(false);
  if (typeof window !== "undefined" && verifiedFlag && !verifiedShownRef.current) {
    verifiedShownRef.current = true;
    toast.success("Email verified — sign in to continue.");
  }

  const safeRedirect =
    redirectPath?.startsWith("/") && !redirectPath.startsWith("//")
      ? redirectPath
      : undefined;
  const registerHref = safeRedirect
    ? `/register?redirect=${encodeURIComponent(safeRedirect)}`
    : "/register";

  const handleGoogleAuth = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
    const target = safeRedirect || "/account";
    const callbackURL = new URL(
      `/auth/oauth-callback?redirect=${encodeURIComponent(target)}`,
      window.location.origin,
    ).toString();
    window.location.href = `${baseUrl || window.location.origin}/auth/login/google?callbackURL=${encodeURIComponent(callbackURL)}&redirect=${encodeURIComponent(target)}`;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    const fd = new FormData(e.currentTarget);
    const payload = {
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
    };

    const parsed = loginZodSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: typeof fieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof typeof errs;
        if (key && !errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    startTransition(async () => {
      try {
        const result = (await loginAction(parsed.data, redirectPath)) as
          | { success: false; message: string }
          | undefined;
        if (result && result.success === false) {
          setServerError(result.message);
          toast.error(result.message);
        }
      } catch (err: unknown) {
        const e = err as { digest?: string; message?: string };
        if (
          (typeof e?.digest === "string" && e.digest.startsWith("NEXT_REDIRECT")) ||
          String(e?.message ?? "").includes("NEXT_REDIRECT")
        ) {
          return;
        }
        const msg = getFriendlyAuthErrorMessage(err, "login");
        setServerError(msg);
        toast.error(msg);
      }
    });
  };

  return (
    <div className="nx-card mx-auto w-full max-w-md p-8 md:p-10">
      <div className="space-y-1">
        <h2 className="text-3xl font-semibold tracking-tight">Sign in.</h2>
        <p className="text-sm text-muted-foreground">
          Continue with Google or use your email.
        </p>
      </div>

      <button
        type="button"
        onClick={handleGoogleAuth}
        className="mt-7 inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-background text-sm font-medium transition-colors hover:bg-secondary"
      >
        <GoogleMark />
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form noValidate onSubmit={onSubmit} ref={formRef} className="space-y-4">
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@nexora.ai"
          error={fieldErrors.email}
          required
          defaultValue={initialEmail}
        />

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold tracking-wide text-foreground/80"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[#4E8D9C] hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="h-12 w-full rounded-2xl border border-border bg-background px-4 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#4E8D9C]"
              placeholder="••••••••"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-foreground/60 hover:bg-secondary"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1.5 text-xs text-red-600">{fieldErrors.password}</p>
          )}
        </div>

        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="nx-btn-primary inline-flex h-12 w-full items-center justify-center gap-2 px-6 text-sm font-semibold disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Nexora?{" "}
        <Link
          href={registerHref}
          className="font-semibold text-foreground hover:text-[#4E8D9C]"
        >
          Create an account
        </Link>
      </p>

      {/* Demo accounts */}
      <div className="mt-8 rounded-3xl border border-dashed border-border bg-yello-100 p-4">
        <div className="flex items-center justify-between">
          <p className="text-[8px]  uppercase text-muted-foreground">
            For recruiters · try a demo
          </p>
          <span className="text-[10px] text-muted-foreground">one click</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((d) => {
            const Icon = d.icon;
            return (
              <button
                key={d.role}
                type="button"
                disabled={pending}
                onClick={() => {
                  setFieldErrors({});
                  setServerError(null);
                  toast.message(`Signing in as ${d.label.toLowerCase()}…`);
                  startTransition(async () => {
                    try {
                      const result = (await d.action(redirectPath)) as
                        | { success: false; message: string }
                        | undefined;
                      if (result && result.success === false) {
                        setServerError(result.message);
                        toast.error(result.message);
                      }
                    } catch (err: unknown) {
                      const e = err as { digest?: string; message?: string };
                      if (
                        (typeof e?.digest === "string" && e.digest.startsWith("NEXT_REDIRECT")) ||
                        String(e?.message ?? "").includes("NEXT_REDIRECT")
                      ) {
                        return;
                      }
                      const msg = getFriendlyAuthErrorMessage(err, "login");
                      setServerError(msg);
                      toast.error(msg);
                    }
                  });
                }}
                className={`group flex flex-col items-center gap-1 rounded-2xl bg-linear-to-br ${d.tint} p-3 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[11px] font-semibold">{d.label}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          seeded read-only data — safe to explore
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  placeholder,
  error,
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-xs font-semibold tracking-wide text-foreground/80"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="mt-1.5 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#4E8D9C]"
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.3 0-9.7-3.3-11.3-8L6.1 32.7C9.4 39 16.1 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C40.9 35.8 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
