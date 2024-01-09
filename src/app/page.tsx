import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import StaggeredText from "~/components/staggered-text";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import HandleUrlToast from "~/components/handle-url-toast";
import Board from "~/components/board";
import { FaCheck } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import { GiProgression } from "react-icons/gi";
import { redirect } from "next/navigation";
import Calendar, { type Event } from "~/components/calendar";

const linkHover =
  "relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left hover:cursor-pointer";

const exampleColumns = [
  {
    id: "todo",
    title: "To do",
    rows: [
      { id: "1", content: "Star this project on github" },
      { id: "2", content: "Visit my portfolio website" },
    ],
  },
  {
    id: "in-progress",
    title: "In progress",
    rows: [
      { id: "3", content: "Exploring this project" },
      { id: "4", content: "Liking what you see" },
      {
        id: "5",
        content: "Say hi to me on Twitter!",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    rows: [
      { id: "6", content: "Followed me on GitHub, right?" },
      { id: "7", content: "Connected with me on LinkedIn, righttt?" },
    ],
  },
];

const exampleEvents: Event[] = [
  { title: "Meeting", start: new Date() },
  { title: "Final Exam", start: new Date(Date.now() + 86400000 * 6) },
  { title: "Dinner with friends", start: new Date(Date.now() + 86400000 * 10) },
];

export default async function Home() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main
      className={`md:snap h-screen snap-mandatory overflow-y-auto md:snap-y`}
    >
      <div className="flex min-h-[100dvh] snap-start flex-col items-center justify-center">
        <div className="relative flex w-full flex-grow items-center justify-center bg-base-100 bg-grid-orange-600/[0.1]">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-base-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className={`flex flex-col items-center justify-center`}>
            <h1
              className={`flex flex-col items-center justify-center text-[min(8vw,2.5rem)] font-bold hover:cursor-default sm:flex-row`}
            >
              Welcome to{" "}
              <span className={`ml-4 text-[min(12vw,4rem)] text-accent`}>
                TasqBoard
              </span>
            </h1>
            <StaggeredText
              text={`Manage your tasks with ease and simplicity. . .`}
              className={`mb-10 hover:cursor-default`}
              fontSize={`1.3rem`}
            />
            <div className={`w-full max-w-sm px-4`}>
              <Link
                href={"/auth/signup"}
                className={`btn btn-outline w-full hover:scale-105`}
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`mb-32 grid min-h-[40dvh] snap-center grid-cols-1 items-center gap-12 bg-base-200 p-4 py-12 text-center md:grid-cols-3`}
      >
        <div
          className={`group flex h-full flex-col items-center justify-center`}
        >
          <FaCheck
            className={`mb-4 text-5xl text-accent transition-transform duration-300 ease-in-out group-hover:scale-125`}
          />
          <h3 className={`mb-2 text-lg font-bold`}>Organize Your Tasks</h3>
          <p className={`max-w-md`}>
            Easily categorize and prioritize your tasks with Tasqboard's
            intuitive interface.
          </p>
        </div>
        <div
          className={`group flex h-full flex-col items-center justify-center`}
        >
          <IoPeople
            className={`mb-4 text-5xl text-accent transition-transform duration-300 ease-in-out group-hover:scale-125`}
          />
          <h3 className={`mb-2 text-lg font-bold`}>Collaborate with Teams</h3>
          <p className={`max-w-md`}>
            Promote collaboration and transparency by sharing task boards with
            your team.
          </p>
        </div>
        <div
          className={`group flex h-full flex-col items-center justify-center`}
        >
          <GiProgression
            className={`mb-4 text-5xl text-accent transition-transform duration-300 ease-in-out group-hover:scale-125`}
          />
          <h3 className={`mb-2 text-lg font-bold`}>Track Your Progress</h3>
          <p className={`max-w-md`}>
            Keep track of your progress with personalized dashboards and
            productivity reports.
          </p>
        </div>
      </div>
      <div
        className={`relative flex min-h-screen snap-start flex-col items-center justify-center px-4`}
      >
        <h3
          className={`mb-3 flex items-center justify-center text-center text-[min(8vw,2.25rem)] font-bold hover:cursor-default`}
        >
          Divide tasks into Boards
        </h3>
        <h4>
          <StaggeredText
            text={`Optimize tasks with the divide and conquer strategy for effortless efficiency.`}
            className={`mb-6   hover:cursor-default`}
          />
        </h4>
        <div className={`w-full sm:px-6 md:px-8`}>
          <Board
            boardId={undefined}
            className={`w-full`}
            data={exampleColumns}
            editable={false}
            name={"Example Board"}
            description={"Example Board Description"}
          />
        </div>
      </div>
      <div
        className={`flex min-h-screen snap-start flex-col items-center justify-center px-4`}
      >
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
        <div className={`w-full max-w-[46rem]`}>
          <Calendar events={exampleEvents} />
        </div>
      </div>
      <footer className="footer snap-start bg-base-200 p-10 text-base-content">
        <nav>
          <header className="footer-title">Services</header>
          <a className={linkHover}>Branding</a>
          <a className={linkHover}>Design</a>
          <a className={linkHover}>Marketing</a>
          <a className={linkHover}>Advertisement</a>
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
            Learning new things since 2022
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
