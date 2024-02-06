import { api } from "~/trpc/server";
import Link from "next/link";
import Board from "~/components/board";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function BoardPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const session = await getServerAuthSession();
  const board = await api.board.fetch.query({
    boardId: id,
  });

  if (!session) return redirect("/auth/signin");

  if (!board || board.creatorId !== session.user.id)
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

  const columns = board.columns
    .sort((a, b) => a.order - b.order)
    .map((column) => ({
      id: column.id,
      title: column.title,
      rows: column.rows
        .sort((a, b) => a.order - b.order)
        .map((row) => ({
          id: row.id,
          content: row.content,
          order: row.order,
        })),
    }));

  return (
    <div className={`p-8`}>
      <Board
        name={board.name}
        description={board.description}
        data={columns}
        boardId={id}
      />
    </div>
  );
}
