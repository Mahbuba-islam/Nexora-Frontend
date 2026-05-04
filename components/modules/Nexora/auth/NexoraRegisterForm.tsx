"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { registerAction } from "@/src/app/(commonLayout)/(authRouteGroup)/register/_action";
import { registerZodSchema } from "@/src/zod/auth.validation";
import { getFriendlyAuthErrorMessage } from "@/src/lib/authErrorMessages";

interface Props {
  redirectPath?: string;
}

export default function NexoraRegisterForm({ redirectPath }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});
  const [pending, startTransition] = useTransition();

  const safeRedirect =
    redirectPath?.startsWith("/") && !redirectPath.startsWith("//")
      ? redirectPath
      : undefined;
  const loginHref = safeRedirect
    ? `/login?redirect=${encodeURIComponent(safeRedirect)}`
    : "/login";

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    const fd = new FormData(e.currentTarget);
    const payload = {
      fullName: String(fd.get("fullName") ?? ""),
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
    };

    const parsed = registerZodSchema.safeParse(payload);
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
        const result = (await registerAction(parsed.data, redirectPath)) as
          | { success: false; message: string }
          | undefined;
        if (result && result.success === false) {
          setServerError(result.message);
          toast.error(result.message);
        } else {
          toast.success("Account created — please sign in.");
        }
      } catch (err: unknown) {
        const e = err as { digest?: string; message?: string };
        if (
          (typeof e?.digest === "string" && e.digest.startsWith("NEXT_REDIRECT")) ||
          String(e?.message ?? "").includes("NEXT_REDIRECT")
        ) {
          return;
        }
        const msg = getFriendlyAuthErrorMessage(err, "register");
        setServerError(msg);
        toast.error(msg);
      }
    });
  };

  return (
    <div className="nx-card mx-auto w-full max-w-md p-8 md:p-10">
      <div className="space-y-1">
        <h2 className="text-3xl font-semibold tracking-tight">
          Create account.
        </h2>
        <p className="text-sm text-muted-foreground">
          It takes 30 seconds. Free forever.
        </p>
      </div>

      <form noValidate onSubmit={onSubmit} className="mt-7 space-y-4">
        <Field
          label="Full name"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          error={fieldErrors.fullName}
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@nexora.ai"
          error={fieldErrors.email}
          required
        />

        <div>
          <label
            htmlFor="password"
            className="text-xs font-semibold tracking-wide text-foreground/80"
          >
            Password
          </label>
          <div className="relative mt-1.5">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={6}
              className="h-12 w-full rounded-2xl border border-border bg-background px-4 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#4E8D9C]"
              placeholder="At least 6 characters"
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

        <p className="text-[11px] text-muted-foreground">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline-offset-4 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        <button
          type="submit"
          disabled={pending}
          className="nx-btn-primary inline-flex h-12 w-full items-center justify-center gap-2 px-6 text-sm font-semibold disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={loginHref}
          className="font-semibold text-foreground hover:text-[#4E8D9C]"
        >
          Sign in
        </Link>
      </p>
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
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
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
        className="mt-1.5 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#4E8D9C]"
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
