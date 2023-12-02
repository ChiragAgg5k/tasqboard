import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { users, verificationTokens } from "~/server/db/schema";
import { v4 } from "uuid";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { env } from "~/env";
import { VerificationEmail } from "~/app/_components/verification-email";
import bycrpt from "bcryptjs";

const resend = new Resend(env.RESEND_API_KEY);

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = v4();
      const hashToken = bycrpt.hashSync(userId, 10);

      // check if user already exists
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (user[0] !== undefined) {
        throw new Error("User already exists! Please sign in instead.");
      }

      try {
        return await Promise.all([
          // Insert into users table
          ctx.db.insert(users).values({
            id: userId,
            name: input.firstName + " " + input.lastName,
            email: input.email,
            password: input.password,
            emailVerified: null,
          }),

          // Insert into verificationTokens table
          ctx.db.insert(verificationTokens).values({
            identifier: userId,
            token: hashToken,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days
          }),

          // Send verification email
          resend.emails.send({
            from: "Tasqboard <chirag@tasqboard.co>",
            to: input.email,
            subject: "Verify your email & get started with Tasqboard",
            react: VerificationEmail({
              verificationToken: hashToken,
              baseUrl: env.NEXTAUTH_URL,
            }),
            html: "<h1>Verify your email</h1>",
          }),
        ]);
      } catch (e) {
        console.log(e);
      }
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

  verify: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const token = await ctx.db
        .select()
        .from(verificationTokens)
        .where(eq(verificationTokens.token, input.token))
        .limit(1);

      if (token[0] === undefined) {
        return {
          name: "TokenNotFound",
          code: "404",
          message: "Token not found ❌",
        };
      }

      if (token[0].expires < new Date()) {
        await ctx.db
          .delete(verificationTokens)
          .where(eq(verificationTokens.token, input.token));

        return {
          name: "TokenExpired",
          code: "404",
          message: "Token expired ❌",
        };
      }

      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, token[0].identifier))
        .limit(1);

      if (user[0] === undefined) {
        return {
          name: "UserNotFound",
          code: "404",
          message: "User not found ❌",
        };
      }

      // check if user is already verified
      if (user[0].emailVerified !== null) {
        return {
          name: "UserAlreadyVerified",
          code: "404",
          message: "User already verified ✅",
          data: user[0],
        };
      }

      await Promise.all([
        ctx.db
          .update(users)
          .set({ emailVerified: new Date() })
          .where(eq(users.id, token[0].identifier)),

        ctx.db
          .delete(verificationTokens)
          .where(eq(verificationTokens.token, input.token)),
      ]);

      return {
        name: "Success",
        code: "200",
        message: "User verified successfully ✅",
        data: user[0],
      };
    }),
});
