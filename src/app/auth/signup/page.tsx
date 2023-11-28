import SignUpForm from "~/app/auth/signup/signup-form";

export default function SignUpPage() {
  return (
    <div className={`flex min-h-screen items-center justify-center`}>
      <div className={`rounded-xl border border-secondary p-8 shadow-md`}>
        <SignUpForm />
      </div>
    </div>
  );
}
