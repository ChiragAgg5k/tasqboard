"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TbLoader3 } from "react-icons/tb";

export default function EditDescription({
  description,
  id,
}: {
  description: string | null;
  id: string;
}) {
  const [newDescription, setNewDescription] = useState<string>(
    description ? description : "",
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const editDescription = api.board.updateDescription.useMutation();

  useEffect(() => {
    if (editDescription.isSuccess) {
      setLoading(false);
      toast.success("Board description updated successfully.");
      router.refresh();
    }

    if (editDescription.isError) {
      setLoading(false);
      toast.error(editDescription.error.message);
    }
  }, [editDescription.isSuccess, editDescription.isError]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (newDescription === description) {
      toast.error("The new name cannot be the same as the old name.");
      return;
    }

    if (newDescription.length < 10) {
      toast.error("The new name must be at least 10 characters long.");
      return;
    }

    if (newDescription.length > 500) {
      toast.error("The new name cannot be longer than 500 characters.");
      return;
    }

    editDescription.mutate({ boardId: id, boardDescription: newDescription });
  };

  return (
    <form className={`flex w-full items-center`} onSubmit={handleSubmit}>
      <textarea
        className={`textarea textarea-bordered mr-4 w-full border-base-content/10`}
        defaultValue={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
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
