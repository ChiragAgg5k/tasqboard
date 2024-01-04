import { api } from "~/trpc/server";
import Link from "next/link";
import DeleteBoardButton from "~/app/_components/delete-board-button";
import { IoMdArrowRoundBack } from "react-icons/io";

export default async function BoardSettings({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const board = await api.board.fetch.query({
    boardId: id,
  });

  if (!board)
    return (
      <div
        className={`flex min-h-[90dvh] flex-col items-center justify-center`}
      >
        <h1 className={`mb-2 text-3xl font-bold`}>Board not found</h1>
        <p className={`mb-4 text-base-content/70`}>
          The board you are looking for does not exist or you do not have
          permission to view it.
        </p>
        <Link href={`/dashboard`} className={`btn`}>
          Back to dashboard
        </Link>
      </div>
    );

  return (
    <div className={`p-8`}>
      <div className={`mb-8 flex items-center justify-between`}>
        <div className={`flex flex-col items-start justify-center`}>
          <h1 className={`mb-2 text-3xl font-bold`}>{board.name}</h1>
          <p className={`text-base-content/70`}>
            {board.description ? board.description : "No description provided."}
          </p>
        </div>
        <Link href={`/boards/${id}`} className={`ghost btn btn`}>
          <IoMdArrowRoundBack className={`text-3xl text-base-content/70`} />
        </Link>
      </div>
      <div
        className={`flex items-center justify-between rounded-xl border p-6`}
      >
        <div>
          <h3 className={`mb-2 text-xl font-bold`}>Delete board</h3>
          <p className={`text-base-content/70`}>
            Permanently delete this board along with all its data. This action
            cannot be undone.
          </p>
        </div>
        <DeleteBoardButton boardId={id} />
      </div>
    </div>
  );
}
