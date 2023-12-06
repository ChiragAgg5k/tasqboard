"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function HandleUrlToast({ toReplace }: { toReplace?: string }) {
  const params = useSearchParams();
  const message = params.get("message");
  const router = useRouter();

  useEffect(() => {
    const wait = async () => {
      if (message) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        toast.success(message);

        if (toReplace) {
          router.replace(toReplace);
        }
      }
    };

    void wait();
  }, []);

  return null;
}
