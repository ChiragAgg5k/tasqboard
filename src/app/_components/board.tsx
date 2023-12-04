"use client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "react-beautiful-dnd";
import { useState } from "react";

const items = [
  { id: "1", content: "First task" },
  { id: "2", content: "Second task" },
  { id: "3", content: "Third task" },
  { id: "4", content: "Fourth task" },
];

export default function Board() {
  const [groups, setGroups] = useState(items);

  const handleDrop = (results: DropResult) => {
    const { source, destination, type } = results;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === "group") {
      const newGroups = [...groups];
      const sourceIndex = source.index;
      const destinationIndex = destination.index;

      const [removed] = newGroups.splice(sourceIndex, 1);

      if (removed === undefined) return;

      newGroups.splice(destinationIndex, 0, removed);

      return setGroups(newGroups);
    }
  };

  return (
    <div className="rounded-md border border-base-content p-4">
      <h1 className="my-8 text-center text-2xl font-bold">Example Board</h1>
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="ROOT" type="group">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`max-w-sm rounded-xl border border-base-content/20 p-4`}
            >
              {groups.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      className={`my-2 rounded-md border border-base-content/20 p-4`}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
