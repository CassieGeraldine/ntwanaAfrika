"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutoSaveIndicatorProps {
  className?: string;
}

/**
 * Shows a subtle indicator of auto-save status
 * - Cloud icon when changes are pending
 * - Check icon when saved
 * - Auto-hides after save confirmation
 */
export function AutoSaveIndicator({ className }: AutoSaveIndicatorProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    // Listen for save events from the context
    const handleSaving = () => setStatus("saving");
    const handleSaved = () => {
      setStatus("saved");
      // Auto-hide after 2 seconds
      setTimeout(() => setStatus("idle"), 2000);
    };

    window.addEventListener("data-saving", handleSaving);
    window.addEventListener("data-saved", handleSaved);

    return () => {
      window.removeEventListener("data-saving", handleSaving);
      window.removeEventListener("data-saved", handleSaved);
    };
  }, []);

  if (status === "idle") return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs text-muted-foreground transition-opacity",
        status === "saved" && "text-green-600 dark:text-green-400",
        className
      )}
    >
      {status === "saving" && (
        <>
          <Cloud className="h-3 w-3 animate-pulse" />
          <span>Saving...</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Check className="h-3 w-3" />
          <span>All changes saved</span>
        </>
      )}
    </div>
  );
}
