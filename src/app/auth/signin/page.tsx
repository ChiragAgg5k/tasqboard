import SignInForm from "~/app/auth/signin/signin-form";

export default function SignInPage() {
  return (
    <div className={`flex min-h-screen items-center justify-center`}>
      <div
        className={`w-full max-w-xl rounded-xl border border-secondary p-6 shadow-md md:p-8`}
      >
        <SignInForm />
      </div>
    </div>
  );
}
