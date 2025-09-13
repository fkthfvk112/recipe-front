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

  console.log("에러", error.message);
  useEffect(() => {
    if(error?.message){
      setErrMsg(error.message);
    }else{
      setErrMsg("알 수 없는 오류가 발생했습니다.");
    }
  }, [error])
 
  
  return (
    <div className='defaultOuterContainer flex pt-20'>
      <div className='defaultInnerContainer flex justify-center items-center flex-col'>
      <h1>문제가 발생하였습니다.</h1>
      <p className='mb-3 p-3'>{errMsg}</p>
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