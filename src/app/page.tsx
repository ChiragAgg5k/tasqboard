import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import StaggeredText from "~/app/_components/staggered-text";
import ScrollText from "~/app/_components/scroll-text";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import HandleUrlToast from "~/app/_components/handle-url-toast";

const linkHover =
  "relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left hover:cursor-pointer";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main>
      <div className="flex min-h-[100dvh] flex-col items-center justify-center">
        <h1
          className={`mb-4 flex flex-col items-center justify-center text-[min(8vw,2.25rem)] font-bold hover:cursor-default sm:flex-row`}
        >
          Welcome to{" "}
          <span className={`ml-4 text-[min(12vw,3.75rem)] text-accent`}>
            TasqBoard
          </span>
        </h1>
        <StaggeredText
          text={`Manage your tasks with ease and simplicity. . .`}
          className={`mb-8 hover:cursor-default`}
        />
        <div className={`w-full max-w-sm px-4`}>
          <Link
            href={session ? "/dashboard" : "/auth/signup"}
            className={`btn btn-outline w-full`}
          >
            {session ? "Go to dashboard" : "Get started"}
          </Link>
        </div>
        <ScrollText />
      </div>
      <div
        className={`relative flex min-h-screen flex-col items-center justify-center`}
      >
        <h3
          className={`mb-3 flex items-center justify-center text-center text-[min(8vw,2.25rem)] font-bold hover:cursor-default`}
        >
          Divide tasks into Boards
        </h3>
        <h4>
          <StaggeredText
            text={`Apply the divide and conquer strategy to your tasks. Makes things easier!`}
            className={`mb-8 hover:cursor-default`}
          />
        </h4>
      </div>
      <div className={`flex min-h-screen flex-col items-center justify-center`}>
        <h3
          className={`mb-3 flex items-center justify-center text-center text-[min(8vw,2.25rem)] font-bold hover:cursor-default`}
        >
          Sync with Google Calendar
        </h3>
        <h4>
          <StaggeredText
            text={`Get time estimates for your tasks and sync them with your Google Calendar.`}
            className={`mb-8 hover:cursor-default`}
          />
        </h4>
      </div>
      <footer className="footer bg-base-200 p-10 text-base-content">
        <nav>
          <header className="footer-title">Services</header>
          <a className="link-hover link">Branding</a>
          <a className="link-hover link">Design</a>
          <a className="link-hover link">Marketing</a>
          <a className="link-hover link">Advertisement</a>
        </nav>
        <nav>
          <header className="footer-title">Company</header>
          <a className={linkHover}>About us</a>
          <a className={linkHover}>Contact</a>
          <a className={linkHover}>Jobs</a>
          <a className={linkHover}>Press kit</a>
        </nav>
        <nav>
          <header className="footer-title">Legal</header>
          <a className={linkHover}>Terms of use</a>
          <Link href={`privacy-policy`} className={linkHover}>
            Privacy policy
          </Link>
          <a className={linkHover}>Cookie policy</a>
        </nav>
      </footer>
      <footer className="footer border-t border-base-300 bg-base-200 px-10 py-4 text-base-content">
        <aside className="grid-flow-col items-center">
          <p>
            <span className={`font-bold`}>ChiragAgg5k</span> <br />
            Learning new things since 2004
          </p>
        </aside>
        <nav className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col items-center gap-6">
            <Link href={`https://chirag.is-a.dev/`} className={`group`}>
              <FaGlobe
                className={`text-3xl text-base-content/70 duration-300 ease-in-out group-hover:scale-110 group-hover:text-base-content`}
              />
            </Link>
            <Link
              href={`https://www.linkedin.com/in/chiragagg5k/`}
              className={`group`}
            >
              <FaLinkedin
                className={`text-3xl text-base-content/70 duration-300 ease-in-out group-hover:scale-110 group-hover:text-base-content`}
              />
            </Link>
            <Link href={`https://github.com/ChiragAgg5k`} className={`group`}>
              <FaGithub
                className={`text-3xl text-base-content/70 duration-300 ease-in-out group-hover:scale-110 group-hover:text-base-content`}
              />
            </Link>
          </div>
        </nav>
      </footer>
      <HandleUrlToast toReplace={`/`} />
    </main>
  );
}
