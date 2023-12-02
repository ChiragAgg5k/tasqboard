import SignInForm from "~/app/auth/signin/signin-form";

export default function SignInPage() {
  return (
    <div className={`flex min-h-screen items-center justify-center`}>
      <div
        className={`w-full max-w-md rounded-xl border-secondary p-8 sm:border sm:shadow-md`}
      >
        <SignInForm />
      </div>
    </div>
  );
}
