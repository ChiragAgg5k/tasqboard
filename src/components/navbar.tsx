import ThemeSwitcher from "~/components/theme-switcher";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import SignOutButton from "~/components/signout-button";

export default async function Navbar() {
  const session = await getServerAuthSession();

  return (
    <div className="navbar fixed z-50 flex items-center justify-between border-b border-base-content/20 bg-base-100">
      <Link className="btn btn-ghost text-xl" href={`/`}>
        Tasqboard
      </Link>
      <ul className={`space-x-4`}>
        {session ? (
          <li>
            <SignOutButton className="btn btn-ghost btn-sm" />
          </li>
        ) : (
          <li>
            <Link className="btn btn-ghost btn-sm" href={`/auth/signin`}>
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
