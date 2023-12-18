import RedirectLink from "~/app/_components/redirect-link";

export default function NotFound() {
  return (
    <div
      className={` flex min-h-[100dvh] flex-col items-center justify-center`}
    >
      <h1 className={`mb-2 text-center text-2xl font-bold`}>
        404 - Page Not Found
      </h1>
      <p className={`mb-4 text-base-content/70`}>
        The page you are looking for does not exist. Please{" "}
        <span className={`font-bold`}>check the URL</span> and try again.
      </p>
      <RedirectLink redirectUrl={`/`} className={`mt-2`}>
        Go back to the home page
      </RedirectLink>
    </div>
  );
}
