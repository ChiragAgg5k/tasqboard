"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton({
  className,
  text,
}: {
  className?: string;
  text?: string;
}) {
  return (
    <button
      onClick={async () => {
        await signOut({ callbackUrl: "/" });
      }}
      className={className}
    >
      {text ? text : "Sign out"}
    </button>
  );
}
