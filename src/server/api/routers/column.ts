import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { columns } from "~/server/db/schema";
import { v4 } from "uuid";

export const columnRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
        columnName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const columnId = v4();

      await ctx.db.insert(columns).values({
        id: columnId,
        title: input.columnName,
        boardId: input.boardId,
      });

      return columnId;
    }),
});
