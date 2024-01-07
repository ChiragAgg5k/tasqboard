"use client";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";

const events = [
  { title: "Meeting", start: new Date() },
  { title: "Final Exam", start: Date.now() + 86400000 * 6 },
  { title: "Dinner with friends", start: Date.now() + 86400000 * 10 },
];

export default function DemoCalendar() {
  return (
    <FullCalendar
      headerToolbar={false}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
}
