"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FallbackPage from "@/app/(commom)/Component/FallbackPage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [errMsg, setErrMsg] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (error?.message) {
      setErrMsg(error.message);
    } else {
      setErrMsg("요청을 처리하는 중 예기치 못한 오류가 발생하였습니다.");
    }
  }, [error]);

  return (
    <FallbackPage
      icon="⚠️"
      title="문제가 발생하였습니다."
      description={errMsg}
      primaryAction={{ label: "다시 시도", onClick: () => reset() }}
      secondaryAction={{ label: "이전으로", onClick: () => router.back() }}
    />
  );
}