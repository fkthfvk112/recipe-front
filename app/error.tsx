'use client' // Error components must be Client Components
 
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [errMsg, setErrMsg] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("에러 보임?", error)
    setErrMsg(error.message)
  }, [error])
 
  
  return (
    <div className='defaultOuterContainer flex pt-20'>
      <div className='defaultInnerContainer flex justify-center items-center flex-col'>
      <h2 className='mb-3'>{errMsg}</h2>
      <div>
        <button
          className='greenBtn me-1'
          onClick={
            () => reset()
          }
        >
          재시도
        </button>
        <button
          className='greenBtn ms-1'
          onClick={
            () => router.back()
          }
        >
          이전으로
        </button>       
      </div>
      </div>
    </div>
  )
}