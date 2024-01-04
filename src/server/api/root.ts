import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { boardRouter } from "~/server/api/routers/board";
import { columnRouter } from "~/server/api/routers/column";
import { rowRouter } from "~/server/api/routers/row";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  board: boardRouter,
  column: columnRouter,
  row: rowRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
