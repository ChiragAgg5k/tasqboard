"use client";

import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { FaEye } from "react-icons/fa";
import { TbLoader3 } from "react-icons/tb";
import { api } from "~/trpc/react";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

const salt = bcrypt.genSaltSync(10);

const checkEmail = (email: string) => {
  return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

const checkPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length > 7) {
    strength++;
  }
  if (password.match(/[a-z]+/)) {
    strength++;
  }
  if (password.match(/[A-Z]+/)) {
    strength++;
  }
  if (password.match(/[0-9]+/)) {
    strength++;
  }
  if (password.match(/[$@#&!]+/)) {
    strength++;
  }
  return strength;
};

export default function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const createUser = api.user.create.useMutation();
  const router = useRouter();

  useEffect(() => {
    if (createUser.isSuccess) {
      toast.success(
        "Account created successfully! Please check your email for an email verification link.",
      );
      setLoading(false);

      router.push("/auth/signin");
    }

    if (createUser.isError) {
      toast.error(
        "An error occurred while creating your account. Please try again later.",
      );
      return;
    }
  }, [createUser.isSuccess, createUser.isError, createUser.error]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      firstName.length < 1 ||
      lastName.length < 1 ||
      email.length < 1 ||
      password.length < 1 ||
      confirmPassword.length < 1
    ) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (!checkEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (passwordStrength < 3) {
      toast.error("Please enter a stronger password.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    const hashedPassword = bcrypt.hashSync(password, salt);

    createUser.mutate({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
  };

  return (
    <form className={`w-full space-y-5`} onSubmit={handleSubmit}>
      <h1 className={`text-center text-2xl font-bold`}>Sign Up</h1>
      <p className={`text-center text-sm`}>
        Welcome to Tasqboard! Ready to get 100% more productive? (not
        guaranteed)
      </p>
      <div className={`flex`}>
        <input
          className={`input input-bordered mr-4 w-full hover:input-accent`}
          placeholder={`First Name`}
          type={`text`}
          id={`first-name`}
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
        <input
          className={`input input-bordered w-full hover:input-accent`}
          placeholder={`Last Name`}
          type={`text`}
          id={`last-name`}
          onChange={(e) => {
            setLastName(e.target.value);
          }}
        />
      </div>
      <input
        className={`input input-bordered w-full hover:input-accent`}
        placeholder={`example@domain.com`}
        type={`email`}
        onChange={(e) => setEmail(e.target.value)}
        id={`email`}
        name={`email`}
      />
      {email.length > 5 && !checkEmail(email) && (
        <p className={`text-xs text-secondary`}>
          Please enter a valid email address.
        </p>
      )}
      <div className={`relative w-full`}>
        <input
          className={`input input-bordered w-full hover:input-accent`}
          placeholder={`A strong password`}
          type={`${showPassword ? "text" : "password"}`}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordStrength(checkPasswordStrength(e.target.value));
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
      {passwordStrength > 0 && (
        <div className={`flex items-center space-x-2`}>
          <p className={`whitespace-nowrap text-xs text-gray-500 `}>
            Password Strength:
          </p>
          <div
            className={`h-2 w-1/5 rounded ${
              passwordStrength > 0 ? "bg-accent" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`h-2 w-1/5 rounded ${
              passwordStrength > 1 ? "bg-accent" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`h-2 w-1/5 rounded ${
              passwordStrength > 2 ? "bg-accent" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`h-2 w-1/5 rounded ${
              passwordStrength > 3 ? "bg-accent" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`h-2 w-1/5 rounded ${
              passwordStrength > 4 ? "bg-accent" : "bg-gray-300"
            }`}
          ></div>
        </div>
      )}
      <input
        className={`input input-bordered w-full hover:input-accent`}
        placeholder={`Confirm that strong password`}
        type={showPassword ? "text" : "password"}
        id={`confirm-password`}
        name={`confirm-password`}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {confirmPassword !== password && confirmPassword.length > 0 && (
        <p className={`text-xs text-secondary`}>Passwords do not match.</p>
      )}
      <button
        className={`btn  btn-accent w-full`}
        disabled={loading}
        type={`submit`}
      >
        <TbLoader3
          className={`mr-2 inline-block animate-spin text-xl ${
            loading ? "" : "hidden"
          }`}
        />
        Sign Up
      </button>
      <p className={`mt-2 text-center text-xs text-gray-500`}>
        By signing up, you agree to our{" "}
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
        <Link href="/auth/signin" className={`link link-accent`}>
          Sign in
        </Link>
        .
      </p>
    </form>
  );
}
