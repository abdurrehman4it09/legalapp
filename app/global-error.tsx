"use client";

import React, { useEffect } from "react";

export default function GlobalError({
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
        if (k && k.startsWith("plp_store_")) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    } catch {
      // Ignore storage access errors
    }
    console.error("Global Error Boundary:", error);
  }, [error]);

  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen bg-white text-gray-900 flex items-center justify-center p-6 font-sans antialiased">
        <div className="max-w-lg w-full border border-gray-200 bg-white p-8 space-y-5">
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-800 border-b border-gray-100 pb-3">
            The Daily Legal Brief · Pakistan Legal Portal
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reloading Legal Workspace
          </h1>
          <p className="text-xs text-gray-600 leading-relaxed">
            Local cache has been refreshed for the 18-table Supabase database. Click below to continue.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                try {
                  reset();
                } catch {
                  window.location.reload();
                }
              }}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold cursor-pointer"
            >
              Reload Page
            </button>
            <a
              href="/"
              className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-semibold"
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
