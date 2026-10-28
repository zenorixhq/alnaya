"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global client error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-background">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold font-serif-luxury text-foreground">
            Something went wrong
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {error?.message || "An unexpected error occurred while loading this page."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-border text-foreground font-semibold text-xs flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
