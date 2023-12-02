import { type ReactNode } from "react";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/auth/signin?error=NotAuthenticated");
  }

  return <main className={`pt-16`}>{children}</main>;
}
