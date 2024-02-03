import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { rows } from "~/server/db/schema";
import { v4 } from "uuid";
import { eq } from "drizzle-orm";

export const rowRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rowId = v4();

      await ctx.db.insert(rows).values({
        id: rowId,
        content: input.content,
        columnId: input.columnId,
      });

      return rowId;
    }),

  updateColumn: protectedProcedure
    .input(
      z.object({
        rowId: z.string(),
        columnId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(rows)
        .set({ columnId: input.columnId })
        .where(eq(rows.id, input.rowId));
    }),

  delete: protectedProcedure
    .input(
      z.object({
        rowId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(rows).where(eq(rows.id, input.rowId));
    }),
});
