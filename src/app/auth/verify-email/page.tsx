"use client";

import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { TbLoader3 } from "react-icons/tb";
import Link from "next/link";

type VerificationResponse = {
  name: string;
  code: string;
  message: string;
  data?: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    password: string | null;
    image: string | null;
  };
};

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const verify = api.user.verify.useMutation();
  const [result, setResult] = useState<VerificationResponse | null>(null);

  useEffect(() => {
    const fn = async () => {
      if (token) {
        const res = await verify.mutateAsync({ token: token });
        setResult(res);
      }
    };

    void fn();
  }, []);

  return (
    <div className={`flex min-h-screen items-center justify-center`}>
      <div className={`rounded-xl bg-base-200 p-8`}>
        {result !== null ? (
          (result.name === "UserAlreadyVerified" && (
            <div>
              <p className={`mb-4`}>Your email has already been verified ✅</p>
              <Link href={`/auth/signin`} className={`btn btn-accent w-full`}>
                Sign In
              </Link>
            </div>
          )) ||
          (result.name === "Success" && (
            <div>
              <p className={`mb-4`}>Email verified successfully 🎉</p>
              <Link href={`/auth/signin`} className={`btn btn-accent w-full`}>
                Sign In
              </Link>
            </div>
          )) || (
            <div className={`text-center`}>
              <p className={`mb-2`}>Something went wrong...</p>
              <p className={`mb-6`}>{result.message}</p>
              <Link href={`/`} className={`btn btn-accent w-full`}>
                Back to home
              </Link>
            </div>
          )
        ) : (
          <p>
            <TbLoader3 className={`text-xl} mr-2 inline-block animate-spin`} />
            Loading...
          </p>
        )}
      </div>
    </div>
  );
}
