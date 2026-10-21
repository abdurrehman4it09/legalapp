"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home, Scale } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith("plp_store_") && !k.startsWith("plp_store_v7_")) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    } catch {
      // Ignore storage access errors
    }
    console.error("Application Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] bg-white text-gray-900 flex items-center justify-center p-6">
      <div className="max-w-lg w-full border border-gray-200 bg-white p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 text-emerald-800 border-b border-gray-100 pb-4">
          <Scale className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">
            The Daily Legal Brief · Pakistan Legal Portal
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="font-legal text-2xl font-bold text-gray-900">
            Synchronizing Legal Workspace
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Your browser cache was updated to match the latest 18-table Supabase schema. Click below to reload the workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              try {
                reset();
              } catch {
                window.location.reload();
              }
            }}
            className="min-h-[44px] px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Workspace</span>
          </button>

          <Link
            href="/"
            className="min-h-[44px] px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
