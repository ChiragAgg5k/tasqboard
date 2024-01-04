import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `tasqboard_${name}`);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  password: varchar("password", { length: 255 }),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

// type Column = {
//     id: string;
//     title: string;
//     rows: Row[];
// };
//
// type Row = {
//     id: string;
//     content: string;
// };

export const boards = mysqlTable(
  "board",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    creatorId: varchar("creatorId", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt", {
      mode: "date",
      fsp: 3,
    }).default(sql`CURRENT_TIMESTAMP(3)`),
  },
  (board) => ({
    creatorIdIdx: index("creatorId_idx").on(board.creatorId),
  }),
);

export const boardsRelations = relations(boards, ({ many }) => ({
  columns: many(columns),
}));

export const columns = mysqlTable(
  "column",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    boardId: varchar("boardId", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt", {
      mode: "date",
      fsp: 3,
    }).default(sql`CURRENT_TIMESTAMP(3)`),
  },
  (column) => ({
    boardIdIdx: index("boardId_idx").on(column.boardId),
  }),
);

export const columnsRelations = relations(columns, ({ one }) => ({
  board: one(boards, { fields: [columns.boardId], references: [boards.id] }),
}));
