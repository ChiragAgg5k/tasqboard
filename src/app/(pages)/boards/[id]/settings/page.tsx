import { api } from "~/trpc/server";
import Link from "next/link";
import DeleteBoardButton from "~/app/_components/delete-board-button";
import { IoMdArrowRoundBack } from "react-icons/io";
import EditName from "~/app/(pages)/boards/[id]/settings/edit-name";
import EditDescription from "~/app/(pages)/boards/[id]/settings/edit-description";

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
    <div className={`space-y-8 p-8`}>
      <div className={`flex items-center justify-between`}>
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
        className={`flex items-center justify-between rounded-xl border border-base-content/10 p-6 shadow-lg`}
      >
        <div className={`w-full`}>
          <h3 className={`mb-1 text-xl font-bold`}>Edit Board Name</h3>
          <p className={`mb-3 text-base-content/70`}>
            Change the name of this board.
          </p>
          <EditName name={board.name} id={board.id} />
        </div>
      </div>
      <div
        className={`flex items-center justify-between rounded-xl border border-base-content/10 p-6 shadow-lg`}
      >
        <div className={`w-full`}>
          <h3 className={`mb-1 text-xl font-bold`}>Edit Board Description</h3>
          <p className={`mb-3 text-base-content/70`}>
            Change the description of this board.
          </p>
          <EditDescription description={board.description} id={board.id} />
        </div>
      </div>
      <div
        className={`flex items-center justify-between rounded-xl border border-error/50 p-6 shadow-lg`}
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
