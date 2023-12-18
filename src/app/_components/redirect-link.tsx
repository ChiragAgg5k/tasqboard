"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";

export default function RedirectLink({
  className,
  children,
  redirectUrl,
}: {
  className?: string;
  children?: ReactNode;
  redirectUrl: string;
}) {
  const router = useRouter();

  return (
    <button
      className={`btn ${className}`}
      onClick={() => {
        router.push(redirectUrl);
      }}
    >
      {children}
    </button>
  );
}
