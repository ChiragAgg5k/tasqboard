import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { users } from "~/server/db/schema";
import { v4 } from "uuid";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(users).values({
        id: v4(),
        name: input.name,
        email: input.email,
        password: input.password,
        emailVerified: null,
      });
    }),

  fetch: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);
    }),
});
