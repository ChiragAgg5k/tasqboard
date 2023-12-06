import { getServerAuthSession } from "~/server/auth";
import NewBoardButton from "~/app/(pages)/dashboard/new-board";
import { api } from "~/trpc/server";
import Link from "next/link";
import HandleUrlToast from "~/app/_components/handle-url-toast";

export default async function Dashboard() {
  const session = await getServerAuthSession();

  if (!session) {
    return;
  }

  const boards = await api.board.fetchAll.query();

  return (
    <div className={`px-6 pt-8`}>
      <p className={`mb-6 text-base-content/80`}>
        Welcome back, <span className={`font-bold`}>{session.user.name}</span>!
        Create a new board or select an existing one to get started.
      </p>
      <div className={`grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3`}>
        {boards.map((board) => (
          <Link
            href={`/boards/${board.id}`}
            key={board.id}
            className={`flex h-52 flex-col items-center justify-center rounded-xl bg-base-200 transition-all duration-300 ease-in-out hover:bg-base-300`}
          >
            <h4 className={`font-bold`}>{board.name}</h4>
            <p className={`text-center text-sm text-base-content/70`}>
              {board.description
                ? board.description.length > 50
                  ? board.description.substring(0, 50) + "..."
                  : board.description
                : "No description provided."}
            </p>
          </Link>
        ))}
        <NewBoardButton />
      </div>

      <hr className={`my-10 border-base-content/20`} />
      <HandleUrlToast toReplace={`/dashboard`} />
    </div>
  );
}
