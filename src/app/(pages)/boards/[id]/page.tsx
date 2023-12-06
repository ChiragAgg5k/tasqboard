import { api } from "~/trpc/server";
import Link from "next/link";

export default async function Board({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const res = await api.board.fetch.query({
    boardId: id,
  });

  const board = res[0];
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
    <div className={`flex min-h-[90dvh] flex-col items-center justify-center`}>
      <h1 className={`mb-2 text-3xl font-bold`}>{board.name}</h1>
      <p className={`mb-4 text-base-content/70`}>
        {board.description ? board.description : "No description provided."}
      </p>
    </div>
  );
}
