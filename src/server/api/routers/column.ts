import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { columns } from "~/server/db/schema";
import { v4 } from "uuid";
import { eq } from "drizzle-orm";

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

  delete: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(columns).where(eq(columns.id, input.columnId));
    }),

  updateOrder: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        order: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(columns)
        .set({ order: input.order })
        .where(eq(columns.id, input.columnId));
    }),
});
