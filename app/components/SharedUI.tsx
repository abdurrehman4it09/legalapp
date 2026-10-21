"use client";

import React, { useEffect, useState, useTransition, useCallback } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * Hook: Listens for the `Escape` key when `isOpen` is true and triggers `onClose`.
 */
export function useEscapeToClose(
  isOpen: boolean,
  onClose?: () => void
): void {
  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
}

/**
 * Inline SVG Loading Spinner for buttons and mutation states
 */
export function InlineSpinner({
  className = "w-4 h-4",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`animate-spin shrink-0 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export interface TactileButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

/**
 * Shared Tactile Button Component
 * Enforces:
 * - Minimum 44x44px touch target (`min-h-[44px] min-w-[44px]`)
 * - Smooth micro-interactions (`transition-all duration-200 active:scale-[0.98]`)
 * - Immediate visual loading feedback (`disabled`, inline SVG spinner, `Processing...`)
 */
export function TactileButton({
  variant = "primary",
  isLoading = false,
  loadingText = "Processing...",
  disabled,
  className = "",
  children,
  type = "button",
  ...rest
}: TactileButtonProps) {
  const variantClasses: Record<NonNullable<TactileButtonProps["variant"]>, string> = {
    primary:
      "bg-[#064E3B] text-white hover:bg-[#04392B] border border-[#064E3B]",
    secondary:
      "bg-stone-900 text-white hover:bg-stone-800 border border-stone-900",
    outline:
      "bg-white text-stone-900 border border-stone-300 hover:bg-stone-50 hover:border-stone-400",
    danger:
      "bg-red-700 text-white hover:bg-red-800 border border-red-700",
    ghost:
      "bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-950 border border-transparent",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] px-4 py-2.5 font-ui text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer whitespace-nowrap shrink-0 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <InlineSpinner className="w-4 h-4" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Server Action Submit Button using `useFormStatus()`
 * Automatically detects pending `<form action={...}>` state and renders an inline SVG spinner.
 */
export function ServerActionSubmitButton({
  loadingText = "Processing...",
  variant = "primary",
  className = "",
  children,
  ...rest
}: TactileButtonProps) {
  const { pending } = useFormStatus();
  return (
    <TactileButton
      type="submit"
      variant={variant}
      isLoading={pending || rest.isLoading}
      loadingText={loadingText}
      className={className}
      {...rest}
    >
      {children}
    </TactileButton>
  );
}

/**
 * Tactile Next.js `<Link>` Wrapper with 44px touch target and tactile hover/press states
 */
export function TactileLink({
  href,
  className = "",
  children,
  onClick,
  ariaLabel,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex items-center min-h-[44px] transition-all duration-200 active:scale-[0.98] ${className}`}
    >
      {children}
    </Link>
  );
}

/**
 * Immediate Mutation Feedback Banner (Success / Error)
 */
export function MutationFeedbackBanner({
  status,
  type,
  message,
  onDismiss,
}: {
  status?: "idle" | "loading" | "success" | "error";
  type?: "idle" | "loading" | "success" | "error";
  message?: string | null;
  onDismiss?: () => void;
}) {
  const effectiveStatus = status || type || "success";
  if (!message || effectiveStatus === "idle" || effectiveStatus === "loading")
    return null;

  const isSuccess = effectiveStatus === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`flex items-start justify-between gap-3 p-3.5 border text-xs sm:text-sm font-ui animate-in fade-in zoom-in-95 duration-200 ${
        isSuccess
          ? "bg-emerald-50 border-emerald-300 text-emerald-950"
          : "bg-red-50 border-red-300 text-red-950"
      }`}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
        )}
        <p className="break-words leading-relaxed font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="min-h-[32px] min-w-[32px] inline-flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all duration-200 active:scale-[0.98] cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/**
 * Shared Accessible Modal / Dialog Component
 * Enforces:
 * 1. Dark backdrop overlay click triggers `onClose`
 * 2. `useEffect` Escape key listener closes modal
 * 3. Top-right `'X'` close button with accessible `aria-label="Close modal"` and 44x44px touch target
 * 4. Tailwind enter/leave animations (`animate-in fade-in zoom-in-95 duration-200`)
 */
export function AccessibleModal({
  isOpen,
  onClose,
  title,
  kicker,
  maxWidthClass = "max-w-2xl",
  dir = "ltr",
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  kicker?: string;
  maxWidthClass?: string;
  dir?: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  useEscapeToClose(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      dir={dir}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-[#FBF9F5] text-stone-950 border border-stone-300 w-full ${maxWidthClass} shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-stone-300 bg-white">
          <div className="min-w-0">
            {kicker && (
              <span className="text-[11px] uppercase tracking-widest text-[#B48327] font-semibold font-ui block truncate">
                {kicker}
              </span>
            )}
            <h3 className="text-base sm:text-lg font-bold font-legal text-stone-950 break-words">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-h-[44px] min-w-[44px] -mr-2 -mt-1 inline-flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-stone-100 transition-all duration-200 active:scale-[0.98] cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/**
 * Hook: Wraps Next.js Server Action & Supabase mutations in `useTransition` with
 * immediate loading state (`isSubmitting`) and result UI feedback (`status`, `feedbackMessage`).
 */
export function useServerActionMutation<TArgs extends any[], TResult = any>(
  mutationFn: (...args: TArgs) => Promise<TResult>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (result: TResult) => void;
  }
) {
  const [isPending, startTransition] = useTransition();
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: TArgs): Promise<TResult | undefined> => {
      setIsManualLoading(true);
      setStatus("loading");
      setFeedbackMessage(null);

      return new Promise<TResult | undefined>((resolve) => {
        startTransition(async () => {
          try {
            const res = await mutationFn(...args);
            const hasError =
              res &&
              typeof res === "object" &&
              "error" in res &&
              Boolean((res as any).error);

            if (hasError) {
              const errMsg =
                (res as any).error?.message ||
                String((res as any).error) ||
                options?.errorMessage ||
                "Unable to complete request. Please check your input and try again.";
              setStatus("error");
              setFeedbackMessage(errMsg);
              setIsManualLoading(false);
              resolve(res);
              return;
            }

            setStatus("success");
            setFeedbackMessage(
              options?.successMessage ||
                "Changes saved and synchronized with Supabase."
            );
            setIsManualLoading(false);
            options?.onSuccess?.(res);
            resolve(res);
          } catch (err: any) {
            setStatus("error");
            setFeedbackMessage(
              err?.message ||
                options?.errorMessage ||
                "An unexpected error occurred while saving."
            );
            setIsManualLoading(false);
            resolve(undefined);
          }
        });
      });
    },
    [mutationFn, options]
  );

  const clearFeedback = useCallback(() => {
    setStatus("idle");
    setFeedbackMessage(null);
  }, []);

  return {
    execute,
    isSubmitting: isPending || isManualLoading,
    isPending,
    status,
    feedbackMessage,
    setFeedbackMessage,
    setStatus,
    clearFeedback,
  };
}
