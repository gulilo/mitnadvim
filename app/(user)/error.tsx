"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Auth section error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Authentication Error
        </h2>

        <p className="text-gray-600 mb-4 text-sm">
          There was a problem with your login.
        </p>

        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-xs">
          <p className="text-red-800 font-mono">{error.message}</p>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={reset}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>

          <button
            onClick={() => (redirect("/"))}
            className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
