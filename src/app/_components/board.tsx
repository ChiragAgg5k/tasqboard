"use client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "react-beautiful-dnd";
import { useState } from "react";

const exampleColumns = [
  {
    id: "todo",
    title: "To do",
    rows: [
      { id: "1", content: "Star this project on github" },
      { id: "2", content: "Visit my portfolio website" },
    ],
  },
  {
    id: "in-progress",
    title: "In progress",
    rows: [
      { id: "3", content: "Exploring this project" },
      { id: "4", content: "Liking what you see" },
      {
        id: "5",
        content: "Say hi to me on Twitter!",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    rows: [
      { id: "6", content: "Followed me on GitHub, right?" },
      { id: "7", content: "Connected with me on LinkedIn, righttt?" },
    ],
  },
];

export default function Board({ className = "" }: { className?: string }) {
  const [columns, setColumns] = useState(exampleColumns);

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

    console.log(results);
  };

  return (
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
                <h3 className={`mb-4 text-center text-xl font-bold`}>
                  {column.title}
                </h3>
                {column.rows.map((row, index) => (
                  <Draggable key={row.id} draggableId={row.id} index={index}>
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
  );
}
