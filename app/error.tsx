'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>에러가 발생하였습니다.</h2>
      <button
        onClick={
          () => reset()
        }
      >
        재시도
      </button>
    </div>
  )
}