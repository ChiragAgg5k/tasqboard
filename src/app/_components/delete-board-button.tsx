"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TbLoader3 } from "react-icons/tb";

export default function DeleteBoardButton({
  boardId,
  className = "",
}: {
  boardId: string;
  className?: string;
}) {
  const deleteBoard = api.board.delete.useMutation();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (deleteBoard.isSuccess) {
      toast.success("Board deleted successfully!");
      router.push(`/dashboard`);
    }

    if (deleteBoard.error) {
      toast.error("Something went wrong. Please try again.");
    }
  }, [deleteBoard.isSuccess]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    deleteBoard.mutate({
      boardId: boardId,
    });
  };

  return (
    <>
      <button
        className={`btn btn-error ${className}`}
        onClick={() => {
          const modal = document.getElementById(
            "delete_board_modal",
          )! as HTMLDialogElement;
          modal.showModal();
        }}
      >
        Delete Board
      </button>
      <dialog id="delete_board_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Are you sure?</h3>
          <p className="py-4 text-base-content/70">
            This action cannot be undone. All tasks and columns will be deleted{" "}
            <span className={`font-bold`}>permanently</span>.
          </p>
          <div className={`modal-action`}>
            <form method="dialog" onSubmit={handleSubmit}>
              <button
                className="btn btn-error mr-2"
                type={"submit"}
                disabled={loading}
              >
                Delete
                {loading && (
                  <TbLoader3
                    className={`mr-2 inline-block animate-spin text-xl`}
                  />
                )}
              </button>
            </form>
            <button
              className="btn"
              onClick={() => {
                const modal = document.getElementById(
                  "delete_board_modal",
                )! as HTMLDialogElement;
                modal.close();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
