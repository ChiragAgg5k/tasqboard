"use client";

import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";

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
      {JSON.stringify(result)}
    </div>
  );
}
