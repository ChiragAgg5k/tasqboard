"use client";
import { signOut } from "next-auth/react";
import { VscSignOut } from "react-icons/vsc";
import { useState } from "react";
import { TbLoader3 } from "react-icons/tb";

export default function SignOutButton({
  className,
  text,
  showIcon,
}: {
  className?: string;
  text?: string;
  showIcon?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        setLoading(true);
        await signOut({
          callbackUrl: "/?message=Signed out successfully.",
        });
      }}
      disabled={loading}
      className={className}
    >
      {text ? text : "Sign out"}
      {showIcon && <VscSignOut className={`text-xl`} />}
      {loading && (
        <TbLoader3 className={`mr-2 inline-block animate-spin text-lg`} />
      )}
    </button>
  );
}
