import SignUpForm from "~/app/auth/signup/signup-form";

export default function SignUpPage() {
  return (
    <div className={`flex min-h-screen items-center justify-center`}>
      <div
        className={`w-full max-w-xl rounded-xl border-secondary p-8 sm:border sm:shadow-md`}
      >
        <SignUpForm />
      </div>
    </div>
  );
}
