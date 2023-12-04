import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { boards } from "~/server/db/schema";
import { v4 } from "uuid";

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
    return await ctx.db.select().from(boards);
  }),
});
