"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { VscSignOut } from "react-icons/vsc";

export default function SignOutButton({
  className,
  text,
  showIcon,
}: {
  className?: string;
  text?: string;
  showIcon?: boolean;
}) {
  return (
    <button
      onClick={async () => {
        await signOut({
          callbackUrl: "/",
        });
      }}
      className={className}
    >
      {text ? text : "Sign out"}
      {showIcon && <VscSignOut className={`text-xl`} />}
    </button>
  );
}
