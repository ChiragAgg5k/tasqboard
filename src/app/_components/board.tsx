"use client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "react-beautiful-dnd";
import { type FormEvent, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";

type Column = {
  id: string;
  title: string;
  rows: Row[];
};

type Row = {
  id: string;
  content: string;
};

export default function Board({
  data,
  className = "",
}: {
  data: Column[];
  className?: string;
}) {
  const [columns, setColumns] = useState<Column[]>(data);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [newColumnName, setNewColumnName] = useState<string>("");
  const [newRowContent, setNewRowContent] = useState<string>("");

  const handleCreateRow = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newRowContent.length > 500) {
      return toast.error("Row content must be less than 500 characters.");
    }

    if (newRowContent.length < 5) {
      return toast.error("Row content must be at least 5 characters.");
    }

    if (!selectedColumn) return;

    const newRow: Row = {
      id: Math.random().toString(36).substring(7),
      content: newRowContent,
    };

    const newColumns = [...columns];
    newColumns.splice(
      newColumns.findIndex((column) => column.id === selectedColumn.id),
      1,
      {
        ...selectedColumn,
        rows: [...selectedColumn.rows, newRow],
      },
    );

    setColumns(newColumns);
    setNewRowContent("");

    const modal = document.getElementById(
      "new_row_modal",
    )! as HTMLDialogElement;
    modal.close();
  };

  const handleCreateColumn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newColumnName.length > 50) {
      return toast.error("Column name must be less than 50 characters.");
    }

    if (newColumnName.length < 5) {
      return toast.error("Column name must be at least 5 characters.");
    }

    const newColumn: Column = {
      id: Math.random().toString(36).substring(7),
      title: newColumnName,
      rows: [],
    };

    setColumns([...columns, newColumn]);
    setNewColumnName("");

    const modal = document.getElementById(
      "new_column_modal",
    )! as HTMLDialogElement;

    modal.close();
  };

  const handleDrop = (results: DropResult) => {
    const { source, destination } = results;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns.find(
      (column) => column.id === source.droppableId,
    );

    const destinationColumn = columns.find(
      (column) => column.id === destination.droppableId,
    );

    if (!sourceColumn || !destinationColumn) return;

    const sourceRow = sourceColumn.rows[source.index];
    const destinationRow = destinationColumn.rows[destination.index];

    if (!sourceRow || !destinationRow) return;

    if (sourceColumn.id === destinationColumn.id) {
      const newRows = [...sourceColumn.rows];
      newRows.splice(source.index, 1);
      newRows.splice(destination.index, 0, sourceRow);
      const newColumns = [...columns];
      newColumns.splice(
        newColumns.findIndex((column) => column.id === source.droppableId),
        1,
        {
          ...sourceColumn,
          rows: newRows,
        },
      );
      setColumns(newColumns);
      return;
    }
    // remove source row
    const newSourceRows = [...sourceColumn.rows];
    newSourceRows.splice(source.index, 1);

    // insert source row into destination
    const newDestinationRows = [...destinationColumn.rows];
    newDestinationRows.splice(destination.index, 0, sourceRow);

    const newColumns = [...columns];
    newColumns.splice(
      newColumns.findIndex((column) => column.id === source.droppableId),
      1,
      {
        ...sourceColumn,
        rows: newSourceRows,
      },
    );

    newColumns.splice(
      newColumns.findIndex((column) => column.id === destination.droppableId),
      1,
      {
        ...destinationColumn,
        rows: newDestinationRows,
      },
    );

    setColumns(newColumns);
  };

  return (
    <div>
      {columns.length > 0 && (
        <div
          className={`grid grid-cols-1 gap-8 rounded-md p-8 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
        >
          <DragDropContext onDragEnd={handleDrop}>
            {columns.map((column, index) => (
              <Droppable droppableId={column.id} type="group" key={index}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`w-full rounded-xl border border-base-content/10 p-6 shadow-lg`}
                  >
                    <div
                      className={`relative mb-4 flex items-center justify-center`}
                    >
                      <h3 className={`text-center text-xl font-bold`}>
                        {column.title}
                      </h3>
                      <div
                        className={`btn btn-ghost btn-sm absolute right-0 ml-2`}
                        onClick={() => {
                          setSelectedColumn(column);
                          const modal = document.getElementById(
                            "new_row_modal",
                          )! as HTMLDialogElement;
                          modal.showModal();
                        }}
                      >
                        <FaPlus />
                      </div>
                    </div>
                    {column.rows.map((row, index) => (
                      <Draggable
                        key={row.id}
                        draggableId={row.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className={`my-2 rounded-md border border-base-content/20 p-4 text-sm hover:shadow-md`}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            {row.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>
      )}

      {columns.length === 0 ? (
        <div
          className={`flex min-h-[40dvh] flex-col items-center justify-center rounded-xl border`}
        >
          <h1 className={`mb-4 text-xl font-bold`}>No columns found . . .</h1>
          <button
            className={`btn`}
            onClick={() => {
              const modal = document.getElementById(
                "new_column_modal",
              )! as HTMLDialogElement;
              modal.showModal();
            }}
          >
            Create your first column
          </button>
        </div>
      ) : (
        <button
          className={`btn`}
          onClick={() => {
            const modal = document.getElementById(
              "new_column_modal",
            )! as HTMLDialogElement;
            modal.showModal();
          }}
        >
          Add new column
        </button>
      )}

      <dialog id="new_row_modal" className="modal">
        <div className="modal-box">
          <h3 className="mb-2 text-lg font-bold">Add new task</h3>
          <p className={`mb-5 text-sm text-base-content/70`}>
            Describe the task you want to add to the column{" "}
          </p>
          <form onSubmit={handleCreateRow}>
            <input
              type="text"
              className={`input input-bordered w-full`}
              placeholder="Task description"
              id={`task-description`}
              name={`task-description`}
              onChange={(e) => setNewRowContent(e.target.value)}
              value={newRowContent}
            />
            <div className={`modal-action`}>
              <button className="btn btn-accent">Create</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className={`hover:cursor-default`}>close</button>
        </form>
      </dialog>

      <dialog id="new_column_modal" className="modal">
        <div className="modal-box">
          <h3 className="mb-2 text-lg font-bold">Add new column</h3>
          <p className={`mb-5 text-sm text-base-content/70`}>
            Give your column a name.
          </p>
          <form onSubmit={handleCreateColumn}>
            <input
              type="text"
              className={`input input-bordered w-full`}
              placeholder="Column name"
              id={`column-name`}
              name={`column-name`}
              onChange={(e) => setNewColumnName(e.target.value)}
              value={newColumnName}
            />
            <div className={`modal-action`}>
              <button className="btn btn-accent">Create</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className={`hover:cursor-default`}>close</button>
        </form>
      </dialog>
    </div>
  );
}
