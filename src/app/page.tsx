import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import StaggeredText from "~/app/_components/staggered-text";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1
        className={`mb-3 flex items-center justify-center text-4xl font-bold hover:cursor-default`}
      >
        Welcome to{" "}
        <span className={`ml-4 text-5xl text-accent hover:animate-pulse`}>
          TasqBoard
        </span>
      </h1>
      <StaggeredText
        text={`Manage your tasks with ease and simplicity.`}
        className={`mb-8 hover:cursor-default`}
      />
      <Link
        href={session ? "/dashboard" : "/api/auth/signin"}
        className={`btn btn-outline w-full max-w-sm`}
      >
        {session ? "Go to dashboard" : "Get started"}
      </Link>
      <p
        className={`fixed bottom-0 w-full pb-4 text-center text-sm text-base-content/50 transition-all duration-200 ease-in-out hover:text-base-content`}
      >
        Scroll down for more info
      </p>
    </main>
  );
}
