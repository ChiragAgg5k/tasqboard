import { getServerAuthSession } from "~/server/auth";

export default async function Dashboard() {
  const user = await getServerAuthSession();

  return <div>{JSON.stringify(user)}</div>;
}
