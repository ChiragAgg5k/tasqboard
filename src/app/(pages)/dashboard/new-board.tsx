"use client";

import { CiCirclePlus } from "react-icons/ci";

export default function NewBoardButton() {
  return (
    <>
      <button
        onClick={() => {
          const modal = document.getElementById(
            "create_new_board",
          )! as HTMLDialogElement;
          modal.showModal();
        }}
        className={`group flex h-52 items-center justify-center rounded-xl border bg-base-200 transition-all duration-300 ease-in-out hover:border-base-content focus:outline-none`}
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
          <form>
            <input
              className={`input input-bordered mb-3 w-full`}
              placeholder="Board name"
            />
            <textarea
              className={`textarea textarea-bordered mb-5 w-full p-4 text-base`}
              placeholder="Board description (max 500 characters...)"
              rows={4}
            />
            <button className="btn btn-accent w-full">Create Board</button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className={`hover:cursor-default`}>close</button>
        </form>
      </dialog>
    </>
  );
}
