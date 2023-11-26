import {getServerAuthSession} from "~/server/auth";

export default async function Home() {

    const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1>Hello {
            session ? session.user.name : 'World'
      }</h1>
        {
            session ? <a href="/api/auth/signout">Logout</a>
            : <a href="/api/auth/signin">Login</a>
        }
    </main>
  );
}
