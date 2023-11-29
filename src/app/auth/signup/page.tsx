import SignUpForm from "~/app/auth/signup/signup-form";

export default function SignUpPage() {
  return (
    <div className={`flex min-h-screen items-center justify-center`}>
      <div
        className={`w-full max-w-xl rounded-xl border border-secondary p-6 shadow-md md:p-8`}
      >
        <SignUpForm />
      </div>
    </div>
  );
}
