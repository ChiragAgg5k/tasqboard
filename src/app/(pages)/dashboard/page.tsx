import { getServerAuthSession } from "~/server/auth";

export default async function Dashboard() {
  const user = await getServerAuthSession();

  return (
    <div className={`flex min-h-screen items-center justify-center`}>
      {JSON.stringify(user)}
    </div>
  );
}
