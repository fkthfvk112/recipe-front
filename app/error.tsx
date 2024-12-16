'use client' // Error components must be Client Components
 
import { useEffect, useState } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("에러 보임?", error)
    setErrMsg(error.message)
  }, [error])
 
  
  return (
    <div className='defaultOuterContainer flex pt-20'>
      <div className='defaultInnerContainer flex justify-center items-center flex-col'>
      <h2 className='mb-3'>{errMsg}</h2>
      <button
        className='greenBtn'
        onClick={
          () => reset()
        }
      >
        재시도
      </button>
      </div>
    </div>
  )
}