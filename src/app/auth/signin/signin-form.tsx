"use client";

import { type FormEvent, useState } from "react";
import { FaEye } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { TbLoader3 } from "react-icons/tb";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    await signIn("credentials", {
      email,
      password,
      callbackUrl: `/`,
    });
  };

  return (
    <form className={`w-full space-y-5`} onSubmit={handleSubmit}>
      <h1 className={`text-center text-2xl font-bold`}>Sign In</h1>
      {error ? (
        <div
          className={`flex items-center justify-start space-x-4 bg-base-200 p-4 text-sm`}
        >
          <MdError className={`text-4xl`} />
          {error === "UserNotFound" && (
            <p>No account found with that email address.</p>
          )}
          {error === "PasswordNotSet" && <p>Please sign in with Google.</p>}
          {error === "InvalidPassword" && (
            <p>Invalid password. Please try again.</p>
          )}
          {error === "EmailNotVerified" && (
            <p>Please verify your email address before signing in.</p>
          )}
        </div>
      ) : (
        <p className={`text-center text-sm`}>
          Welcome back to Tasqboard! Sign in to continue.
        </p>
      )}
      <input
        className={`input input-bordered w-full hover:input-accent`}
        placeholder={`Email`}
        type={`email`}
        onChange={(e) => setEmail(e.target.value)}
        id={`email`}
        name={`email`}
        required
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
          required
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
      <button
        className={`btn btn-accent w-full`}
        type={`submit`}
        disabled={loading}
      >
        <TbLoader3
          className={`mr-2 inline-block animate-spin text-xl ${
            loading ? "" : "hidden"
          }`}
        />
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
        <FaGoogle className={`ml-2`} />
      </button>
      <p className={`mt-2 text-center text-xs text-gray-500`}>
        By signing in, you agree to our{" "}
        <a href="#" className={`link-base-content link`}>
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className={`link-base-content link`}>
          Privacy Policy
        </a>
        .
      </p>
      <p className={`text-center text-sm`}>
        Already have an account?{" "}
        <Link href="/auth/signup" className={`link link-accent`}>
          Sign Up
        </Link>
        .
      </p>
    </form>
  );
}
