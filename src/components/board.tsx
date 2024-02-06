"use client";
import dynamic from "next/dynamic";
import { type FormEvent, useEffect, useState } from "react";
import { FaCheck, FaMinus, FaPencilAlt, FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import Link from "next/link";
import { IoIosSettings } from "react-icons/io";
import { MdDoneOutline } from "react-icons/md";
import { type DropResult } from "react-beautiful-dnd";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TbLoader3 } from "react-icons/tb";

const DragDropContext = dynamic(
  async () => {
    const mod = await import("react-beautiful-dnd");
    return mod.DragDropContext;
  },
  {
    ssr: false,
    loading: () => (
      <p
        className={`col-span-3 flex min-h-[50dvh] w-full items-center justify-center text-base-content/70`}
      >
        <TbLoader3 className={`mr-2 inline-block animate-spin`} />
        Loading...
      </p>
    ),
  },
);

const Droppable = dynamic(
  async () => {
    const mod = await import("react-beautiful-dnd");
    return mod.Droppable;
  },
  { ssr: false },
);

const Draggable = dynamic(
  async () => {
    const mod = await import("react-beautiful-dnd");
    return mod.Draggable;
  },
  { ssr: false },
);

type Column = {
  id: string;
  title: string;
  rows: Row[];
};

type Row = {
  id: string;
  content: string;
  order?: number;
};

export default function Board({
  boardId,
  name,
  description = null,
  data,
  editable = true,
}: {
  boardId: string | undefined;
  name: string;
  description: string | null;
  data: Column[];
  editable?: boolean;
}) {
  const [updates, setUpdates] = useState(0);

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [showDueDateSelector, setShowDueDateSelector] = useState(false);

  const [columns, setColumns] = useState<Column[]>(data);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [newColumnName, setNewColumnName] = useState<string>("");
  const [newRowContent, setNewRowContent] = useState<string>("");

  const createColumn = api.column.create.useMutation();
  const createRow = api.row.create.useMutation();
  const updateColumn = api.row.updateColumn.useMutation();
  const deleteColumn = api.column.delete.useMutation();
  const deleteRow = api.row.delete.useMutation();
  const updateRowOrder = api.row.updateOrder.useMutation();
  const updateColumnOrder = api.column.updateOrder.useMutation();

  useEffect(() => {
    if (createColumn.isSuccess) {
      setUpdates(updates - 1);
    }
    if (createRow.isSuccess) {
      setUpdates(updates - 1);
    }
    if (updateColumn.isSuccess) {
      setUpdates(updates - 1);
    }
    if (deleteColumn.isSuccess) {
      setUpdates(updates - 1);
    }

    if (deleteRow.isSuccess) {
      setUpdates(updates - 1);
    }

    if (updateRowOrder.isSuccess) {
      setUpdates(updates - 1);
    }

    if (updateColumnOrder.isSuccess) {
      setUpdates(updates - 1);
    }
  }, [
    createColumn.isSuccess,
    createRow.isSuccess,
    deleteColumn.isSuccess,
    deleteRow.isSuccess,
    updateColumn.isSuccess,
    updateRowOrder.isSuccess,
    updateColumnOrder.isSuccess,
  ]);

  const handleRemoveColumn = () => {
    if (!selectedColumn) {
      return;
    }

    deleteColumn.mutate({
      columnId: selectedColumn.id,
    });
    setUpdates(updates + 1);

    const newColumns = [...columns];
    newColumns.splice(
      newColumns.findIndex((column) => column.id === selectedColumn.id),
      1,
    );

    setColumns(newColumns);
  };

  const handleRemoveRow = () => {
    if (!selectedColumn || !selectedRow) {
      return;
    }

    deleteRow.mutate({
      rowId: selectedRow.id,
    });
    setUpdates(updates + 1);

    const newColumns = [...columns];
    newColumns.splice(
      newColumns.findIndex((column) => column.id === selectedColumn.id),
      1,
      {
        ...selectedColumn,
        rows: selectedColumn.rows.filter((row) => row.id !== selectedRow.id),
      },
    );

    setColumns(newColumns);
  };

  const handleCreateRow = () => {
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

    if (boardId) {
      createRow.mutate({
        columnId: selectedColumn.id,
        content: newRowContent,
      });
      setUpdates(updates + 1);
    }

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

    if (newColumnName.length < 4) {
      return toast.error("Column name must be at least 4 characters.");
    }

    const newColumn: Column = {
      id: Math.random().toString(36).substring(7),
      title: newColumnName,
      rows: [],
    };

    if (boardId) {
      createColumn.mutate({
        boardId: boardId,
        columnName: newColumnName,
      });
      setUpdates(updates + 1);
    }

    setColumns([newColumn, ...columns]);
    setNewColumnName("");

    const modal = document.getElementById(
      "new_column_modal",
    )! as HTMLDialogElement;

    modal.close();
  };

  const handleDropRow = (results: DropResult) => {
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

    if (sourceRow && !destinationRow) {
      if (boardId) {
        updateColumn.mutate({
          columnId: destination.droppableId,
          rowId: sourceRow.id,
        });
        setUpdates(updates + 1);

        updateRowOrder.mutate({
          rowId: sourceRow.id,
          order: destination.index,
        });
        setUpdates(updates + 1);
      }

      return setColumns(
        columns.map((column) => {
          if (column.id === source.droppableId) {
            return {
              ...column,
              rows: column.rows.filter((row) => row.id !== sourceRow.id),
            };
          }
          if (column.id === destination.droppableId) {
            return {
              ...column,
              rows: [...column.rows, sourceRow],
            };
          }
          return column;
        }),
      );
    }

    if (!sourceRow || !destinationRow) return;

    if (sourceColumn.id === destinationColumn.id) {
      updateRowOrder.mutate({
        rowId: sourceRow.id,
        order: destination.index,
      });
      setUpdates(updates + 1);

      updateRowOrder.mutate({
        rowId: destinationRow.id,
        order: source.index,
      });
      setUpdates(updates + 1);

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

    if (boardId) {
      updateColumn.mutate({
        columnId: destination.droppableId,
        rowId: sourceRow.id,
      });
      setUpdates(updates + 1);

      updateRowOrder.mutate({
        rowId: sourceRow.id,
        order: destination.index,
      });
      setUpdates(updates + 1);

      updateColumn.mutate({
        columnId: source.droppableId,
        rowId: destinationRow.id,
      });
      setUpdates(updates + 1);
    }
  };

  const handleDrop = (results: DropResult) => {
    if (results.type === "column") {
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

      const newColumns = [...columns];
      const column = newColumns.splice(source.index, 1)[0];
      const destinationColumnId = newColumns[destination.index]?.id;

      if (!column || !destinationColumnId) return;

      if (boardId) {
        updateColumnOrder.mutate({
          columnId: column.id,
          order: destination.index,
        });
        setUpdates(updates + 1);

        updateColumnOrder.mutate({
          columnId: destinationColumnId,
          order: source.index,
        });
      }

      newColumns.splice(destination.index, 0, column);

      setColumns(newColumns);
    } else {
      handleDropRow(results);
    }
  };

  return (
    <>
      {editable && (
        <div className={`mb-4 flex items-center justify-between`}>
          <div className={`flex flex-col items-start justify-center`}>
            <h1 className={`mb-2 text-3xl font-bold`}>{name}</h1>
            <p className={`text-base-content/70`}>
              {description ? description : "No description provided."}
            </p>
          </div>
          <div
            className={`flex flex-col-reverse items-center justify-center sm:flex-row`}
          >
            <button
              className={`ghost btn sm:mr-2`}
              onClick={() => setMode(mode === "view" ? "edit" : "view")}
            >
              {mode === "view" ? (
                <div className="tooltip tooltip-bottom" data-tip="Edit Columns">
                  <FaPencilAlt
                    className={`text-2xl text-base-content/70 md:text-3xl`}
                  />
                </div>
              ) : (
                <div className="tooltip tooltip-bottom" data-tip="Done">
                  <MdDoneOutline
                    className={`text-2xl text-base-content/70 md:text-3xl`}
                  />
                </div>
              )}
            </button>
            <button
              className={`ghost btn mb-2 sm:mb-0 sm:mr-4`}
              onClick={() => {
                const modal = document.getElementById(
                  "new_column_modal",
                )! as HTMLDialogElement;
                modal.showModal();
              }}
            >
              <div className="tooltip tooltip-bottom" data-tip="Add Column">
                <FaPlus
                  className={`text-2xl text-base-content/70 md:text-3xl`}
                />
              </div>
            </button>
            <Link
              href={`/boards/${boardId}/settings`}
              className={`ghost btn mb-4 sm:mb-0`}
            >
              <div className="tooltip tooltip-bottom" data-tip="Settings">
                <IoIosSettings
                  className={`text-2xl text-base-content/70 md:text-3xl`}
                />
              </div>
            </Link>
          </div>
        </div>
      )}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
          <DragDropContext onDragEnd={handleDrop}>
            <Droppable
              droppableId={`board`}
              type={`column`}
              direction={`horizontal`}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`grid grid-cols-1 gap-8 rounded-md py-8 sm:grid-cols-2 lg:grid-cols-3`}
                >
                  {columns.map((column, index) => (
                    <Draggable
                      key={column.id}
                      draggableId={column.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className={`relative`}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <Droppable
                            droppableId={column.id}
                            type="group"
                            key={index}
                          >
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`h-full min-h-[10rem] w-full rounded-xl border border-base-content/10 p-6 pb-12 shadow-lg`}
                              >
                                <div
                                  className={`relative mb-4 flex items-center justify-center`}
                                >
                                  <h3
                                    className={`text-center text-xl font-bold`}
                                  >
                                    {column.title}
                                  </h3>
                                  {mode === "view" ? (
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
                                      <div
                                        className="tooltip tooltip-top"
                                        data-tip="Add Task"
                                      >
                                        <FaPlus />
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => {
                                        setSelectedColumn(column);
                                        const modal = document.getElementById(
                                          "removed_column_modal",
                                        )! as HTMLDialogElement;
                                        modal.showModal();
                                      }}
                                      className={`btn btn-ghost btn-sm absolute right-0 ml-2`}
                                    >
                                      <FaMinus />
                                    </div>
                                  )}
                                </div>
                                {column.rows.map((row, index) => (
                                  <Draggable
                                    key={row.id}
                                    draggableId={row.id}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        className={`relative my-4 rounded-md border border-base-content/20 p-4 text-sm hover:shadow-md`}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                        onClick={() => {
                                          setSelectedColumn(column);
                                          setSelectedRow(row);
                                          const modal = document.getElementById(
                                            "row_info_modal",
                                          )! as HTMLDialogElement;
                                          modal.showModal();
                                        }}
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
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {columns.length === 0 && (
                    <div
                      className={`col-span-3 flex min-h-[50dvh] flex-row items-center justify-center text-base-content/80`}
                    >
                      Wow, such{" "}
                      <span
                        className={`ml-1 inline-block font-bold text-base-content/70`}
                      >
                        empty
                      </span>
                      .
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {editable && (
          <div
            className={`flex items-center justify-end text-sm text-base-content/50`}
          >
            {updates === 0 ? (
              <p className={`btn btn-sm fixed bottom-8 right-8`}>
                Saved
                <FaCheck className={`inline-block text-base-content/50`} />
              </p>
            ) : (
              <p
                className={`btn btn-sm fixed bottom-8 right-8 animate-pulse`}
                onClick={() => {
                  toast.error(
                    "Likely there was an error saving your changes. Please try refreshing the page.",
                  );
                }}
              >
                Saving...
              </p>
            )}
          </div>
        )}

        <dialog id="new_row_modal" className="modal">
          <div className="modal-box overflow-visible">
            <h3 className="mb-2 text-lg font-bold">Add new task</h3>
            <p className={`mb-5 text-sm text-base-content/70`}>
              Describe the task you want to add to the column{" "}
            </p>
            <input
              type="text"
              className={`input input-bordered w-full`}
              placeholder="Task description"
              id={`task-description`}
              name={`task-description`}
              onChange={(e) => setNewRowContent(e.target.value)}
              value={newRowContent}
            />
            <div className={`flex items-center justify-end pt-6`}>
              {showDueDateSelector ? (
                <div className={`w-full`}>
                  <hr className={`my-4 border-base-content/20`} />
                  <div className={`flex items-center justify-center`}>
                    <div className={`mr-4`}>
                      <p className={`mb-2 text-sm text-base-content/70`}>
                        Start date
                      </p>
                      <DatePicker
                        className={`rounded bg-gray-100`}
                        slotProps={{
                          textField: {
                            size: "small",
                          },
                          popper: {
                            placement: "bottom-end",
                            disablePortal: true,
                          },
                        }}
                      />
                    </div>
                    <div>
                      <p className={`mb-2 text-sm text-base-content/70`}>
                        Due date
                      </p>
                      <DatePicker
                        className={`rounded bg-gray-100`}
                        slotProps={{
                          textField: {
                            size: "small",
                          },
                          popper: {
                            placement: "bottom-end",
                            disablePortal: true,
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className={`flex w-full items-center justify-end pt-6`}>
                    <div>
                      <button
                        className={`btn mr-4`}
                        onClick={() => setShowDueDateSelector(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-accent"
                        onClick={handleCreateRow}
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    className={`btn mr-4`}
                    onClick={() => setShowDueDateSelector(true)}
                  >
                    Add due date
                  </button>
                  <button className="btn btn-accent" onClick={handleCreateRow}>
                    Create
                  </button>
                </div>
              )}
            </div>
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

        <dialog id="removed_column_modal" className="modal">
          <div className="modal-box">
            <h3 className="mb-2 text-lg font-bold">Remove column</h3>
            <p className={`mb-5 text-sm text-base-content/70`}>
              Are you sure you want to remove the column "
              {selectedColumn?.title}"?
            </p>
            <div className={`modal-action`}>
              <form method="dialog">
                <button
                  className="btn btn-error mr-2"
                  type={"submit"}
                  onClick={handleRemoveColumn}
                >
                  Remove
                </button>
              </form>
              <button
                className="btn"
                onClick={() => {
                  const modal = document.getElementById(
                    "removed_column_modal",
                  )! as HTMLDialogElement;
                  modal.close();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button className={`hover:cursor-default`}>close</button>
          </form>
        </dialog>

        <dialog id="row_info_modal" className="modal">
          <div className="modal-box">
            <h3 className="mb-2 text-lg font-bold">Task Details</h3>
            <p className={`mb-5 text-sm text-base-content/70`}>
              {selectedRow?.content}
            </p>
            <div className={`modal-action`}>
              <form method="dialog">
                <button
                  className="btn btn-error btn-sm mr-2"
                  type={"submit"}
                  onClick={handleRemoveRow}
                >
                  Remove
                </button>
              </form>
              <button
                className="btn btn-sm"
                onClick={() => {
                  const modal = document.getElementById(
                    "row_info_modal",
                  )! as HTMLDialogElement;
                  modal.close();
                }}
              >
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button className={`hover:cursor-default`}>close</button>
          </form>
        </dialog>
      </LocalizationProvider>
    </>
  );
}
