"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [email, setEmail] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.message("Sign up successful!");
  };

  return (
    <form className={`w-full max-w-md space-y-5`} onSubmit={handleSubmit}>
      <h1 className={`text-center text-2xl font-bold`}>Sign Up</h1>
      <p className={`text-center text-sm`}>
        Welcome to Tasqboard! Create an account to get started.
      </p>
      <div className={`flex`}>
        <input
          className={`input input-bordered mr-4 w-full`}
          placeholder={`First Name`}
          type={`text`}
          id={`first-name`}
        />
        <input
          className={`input input-bordered w-full`}
          placeholder={`Last Name`}
          type={`text`}
          id={`last-name`}
        />
      </div>
      <input
        className={`input input-bordered w-full`}
        placeholder={`Email`}
        type={`email`}
        onChange={(e) => setEmail(e.target.value)}
        id={`email`}
        name={`email`}
      />
      {email.length > 0 && !checkEmail(email) && (
        <p className={`text-xs text-primary`}>
          Please enter a valid email address.
        </p>
      )}
      <input
        className={`input input-bordered w-full`}
        placeholder={`Password`}
        type={`password`}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordStrength(checkPasswordStrength(e.target.value));
        }}
        id={`password`}
        name={`password`}
      />
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
        className={`input input-bordered w-full`}
        placeholder={`Confirm Password`}
        type={`password`}
        id={`confirm-password`}
        name={`confirm-password`}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {confirmPassword !== password && confirmPassword.length > 0 && (
        <p className={`text-xs text-primary`}>Passwords do not match.</p>
      )}
      <button className={`btn  btn-accent w-full`}>Sign Up</button>
      <p className={`mt-2 text-center text-xs text-gray-500`}>
        By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </p>

      <p className={`text-center text-sm`}>
        Already have an account?{" "}
        <a href="#" className={`link link-accent`}>
          Sign in
        </a>
        .
      </p>
    </form>
  );
}
