import ThemeSwitcher from "~/app/_components/theme-switcher";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export default async function Navbar() {
  const session = await getServerAuthSession();

  return (
    <div className="navbar fixed flex items-center justify-between bg-base-100">
      <Link className="btn btn-ghost text-xl" href={`/`}>
        Tasqboard
      </Link>
      <ul className={`space-x-4`}>
        {session ? (
          <li>
            <Link className="btn btn-ghost btn-sm" href={`/api/auth/signout`}>
              Sign out
            </Link>
          </li>
        ) : (
          <li>
            <Link className="btn btn-ghost btn-sm" href={`/api/auth/signin`}>
              Sign in
            </Link>
          </li>
        )}
        <li>
          <ThemeSwitcher />
        </li>
      </ul>
    </div>
  );
}
