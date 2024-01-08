"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TbLoader3 } from "react-icons/tb";

export default function EditName({ name, id }: { name: string; id: string }) {
  const [newName, setNewName] = useState(name);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const editName = api.board.updateName.useMutation();

  useEffect(() => {
    if (editName.isSuccess) {
      setLoading(false);
      toast.success("Board name updated successfully.");
      router.refresh();
    }

    if (editName.isError) {
      setLoading(false);
      toast.error(editName.error.message);
    }
  }, [editName.isSuccess, editName.isError]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (newName === name) {
      toast.error("The new name cannot be the same as the old name.");
      return;
    }

    if (newName.length < 3) {
      toast.error("The new name must be at least 3 characters long.");
      return;
    }

    if (newName.length > 50) {
      toast.error("The new name cannot be longer than 50 characters.");
      return;
    }

    editName.mutate({ boardId: id, boardName: newName });
  };

  return (
    <form className={`flex w-full`} onSubmit={handleSubmit}>
      <input
        className={`input input-bordered mr-4 w-full border-base-content/10`}
        defaultValue={name}
        onChange={(e) => setNewName(e.target.value)}
      />
      <button className={`btn btn-primary`} disabled={loading}>
        Save
        {loading && (
          <TbLoader3 className={`mr-2 inline-block animate-spin text-xl`} />
        )}
      </button>
    </form>
  );
}
