import { api } from "~/trpc/server";
import Link from "next/link";
import Board from "~/app/_components/board";
import { IoIosSettings } from "react-icons/io";

export default async function BoardPage({
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

  const columns = board.columns.map((column) => ({
    id: column.id,
    title: column.title,
    rows: column.rows.map((row) => ({
      id: row.id,
      content: row.content,
    })),
  }));

  return (
    <div className={`p-8`}>
      <div className={`mb-4 flex items-center justify-between`}>
        <div className={`flex flex-col items-start justify-center`}>
          <h1 className={`mb-2 text-3xl font-bold`}>{board.name}</h1>
          <p className={`text-base-content/70`}>
            {board.description ? board.description : "No description provided."}
          </p>
        </div>
        <Link href={`/boards/${id}/settings`} className={`ghost btn`}>
          <IoIosSettings className={`text-3xl text-base-content/70`} />
        </Link>
      </div>
      <Board data={columns} boardId={id} />
    </div>
  );
}
