"use client";

import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: `/`,
      });
    } catch (error) {
      toast.error(
        "An error occurred while signing in. Please try again later.",
      );
    }
  };

  return (
    <form className={`w-full space-y-6`} onSubmit={handleSubmit}>
      <h1 className={`text-center text-2xl font-bold`}>Sign In</h1>
      <p className={`text-center text-sm`}>
        Welcome back! Sign in to continue.
      </p>
      <input
        className={`input input-bordered w-full hover:input-accent`}
        placeholder={`Email`}
        type={`email`}
        onChange={(e) => setEmail(e.target.value)}
        id={`email`}
        name={`email`}
      />
      <div className={`relative w-full`}>
        <input
          className={`input input-bordered w-full hover:input-accent`}
          placeholder={`Password`}
          type={`${showPassword ? "text" : "password"}`}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          id={`password`}
          name={`password`}
        />
        <div
          className={`btn btn-ghost btn-sm absolute right-2 top-2 text-lg`}
          onClick={() => {
            if (!showPassword) {
              setShowPassword(true);
              setTimeout(() => {
                setShowPassword(false);
              }, 3000);
              return;
            }

            setShowPassword(false);
          }}
        >
          <FaEye />
        </div>
      </div>
      <button className={`btn btn-accent w-full`} type={`submit`}>
        Sign In
      </button>
      <button
        className={`btn w-full`}
        type={`button`}
        onClick={async () => {
          await signIn("google", {
            callbackUrl: `/`,
          });
        }}
      >
        Sign In with Google
      </button>
    </form>
  );
}
