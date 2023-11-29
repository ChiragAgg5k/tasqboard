"use client";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
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
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await signOut({
          redirect: false,
        });

        toast.success("Signed out successfully!");

        router.push("/");
        router.refresh();
      }}
      className={className}
    >
      {text ? text : "Sign out"}
      {showIcon && <VscSignOut className={`text-xl`} />}
    </button>
  );
}
