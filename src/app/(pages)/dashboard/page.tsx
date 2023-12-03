import { getServerAuthSession } from "~/server/auth";
import NewBoardButton from "~/app/(pages)/dashboard/new-board";
import Board from "~/app/_components/board";

export default async function Dashboard() {
  const session = await getServerAuthSession();

  if (!session) {
    return;
  }

  return (
    <div className={`px-6 pt-8`}>
      <p className={`mb-4 text-base-content/80`}>
        Welcome back, <span className={`font-bold`}>{session.user.name}</span>!
        Create a new board or select an existing one to get started.
      </p>
      <div className={`grid grid-cols-3 gap-6`}>
        <NewBoardButton />
      </div>

      <hr className={`my-8 border-base-content/20`} />

      <Board />
    </div>
  );
}
