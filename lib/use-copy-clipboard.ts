import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shared hook for copy-to-clipboard with auto-reset.
 * Replaces duplicate logic in ContactActionButtons and SiteFooter.
 */
export function useCopyClipboard(timeout = 1800) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(
    async (value: string) => {
      if (!value) return false;

      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [timeout],
  );

  return { copied, copy } as const;
}
