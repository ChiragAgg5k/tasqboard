"use client";

import { CiCirclePlus } from "react-icons/ci";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { TbLoader3 } from "react-icons/tb";

export default function NewBoardButton() {
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const createBoard = api.board.create.useMutation();
  const router = useRouter();

  useEffect(() => {
    if (createBoard.isSuccess) {
      setLoading(false);
      toast.success("Board created successfully!");
      const boardId = createBoard.data;
      router.push(`/boards/${boardId}`);
    }

    if (createBoard.error) {
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  }, [createBoard.isSuccess]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (boardName.length > 50) {
      return toast.error("Board name must be less than 50 characters.");
    }

    if (boardDescription.length > 500) {
      return toast.error("Board description must be less than 500 characters.");
    }

    if (boardName.length < 5) {
      return toast.error("Board name must be at least 5 characters.");
    }

    setLoading(true);

    createBoard.mutate({
      boardName: boardName,
      boardDescription: boardDescription,
    });
  };

  return (
    <>
      <button
        onClick={() => {
          const modal = document.getElementById(
            "create_new_board",
          )! as HTMLDialogElement;
          modal.showModal();
        }}
        className={`group flex h-52 w-full items-center justify-center rounded-xl border border-base-content/50 bg-base-200 transition-all duration-300 ease-in-out hover:border-base-content focus:outline-none`}
      >
        <CiCirclePlus
          className={`text-4xl text-base-content/50 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:text-base-content`}
        />
      </button>
      <dialog id="create_new_board" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="mb-2 text-lg font-bold">Create new board</h3>
          <p className={`mb-5 text-sm text-base-content/70`}>
            Give your board a name and description. You can{" "}
            <span className={`font-bold`}>edit</span> these later as well.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              onChange={(e) => setBoardName(e.target.value)}
              required
              className={`input input-bordered mb-3 w-full`}
              placeholder="Board name"
              id={`board-name`}
              name={`board-name`}
            />
            <textarea
              onChange={(e) => setBoardDescription(e.target.value)}
              className={`textarea textarea-bordered mb-5 w-full p-4 text-base`}
              placeholder="Board description (max 500 characters...)"
              rows={4}
              id={`board-description`}
              maxLength={500}
              name={`board-description`}
            />
            <button className="btn btn-accent w-full" disabled={loading}>
              <TbLoader3
                className={`mr-2 inline-block animate-spin text-xl ${
                  loading ? "block" : "hidden"
                }`}
              />
              Create Board
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className={`hover:cursor-default`}>close</button>
        </form>
      </dialog>
    </>
  );
}
