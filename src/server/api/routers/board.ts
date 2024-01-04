import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { boards } from "~/server/db/schema";
import { v4 } from "uuid";
import { eq } from "drizzle-orm";

export const boardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        boardName: z.string(),
        boardDescription: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const boardId = v4();

      await ctx.db.insert(boards).values({
        id: boardId,
        name: input.boardName,
        description: input.boardDescription,
        creatorId: ctx.session.user.id,
      });

      return boardId;
    }),

  fetchAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.boards.findMany({});
  }),

  fetch: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.boards.findFirst({
        where: eq(boards.id, input.boardId),
        with: {
          columns: {
            with: {
              rows: true,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(boards).where(eq(boards.id, input.boardId));
    }),
});
