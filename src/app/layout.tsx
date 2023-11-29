import "~/styles/globals.css";

import { Montserrat } from "next/font/google";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "~/app/_components/navbar";
import { Toaster } from "sonner";
import { type ReactNode } from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Tasqboard",
  description:
    "Tasqboard is a simple task management app that aims to make task management easier by dividing tasks into boards, generating time estimates for tasks, and syncing with Google Calendar.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans ${montserrat.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <Navbar />
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
