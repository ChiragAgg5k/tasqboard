"use client";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";

export type Event = {
  title: string;
  start: Date;
};

export default function Calendar({ events }: { events: Event[] }) {
  return (
    <FullCalendar
      headerToolbar={false}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
}
