import { getServerAuthSession } from "~/server/auth";
import { type ReactNode } from "react";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard?message=You're already signed in.");
  }

  return <main>{children}</main>;
}
