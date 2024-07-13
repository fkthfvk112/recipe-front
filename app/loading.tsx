import { CircularProgress } from "@mui/material";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <>
      <div className="flex justify-center items-center h-svh ">
        <CircularProgress />
      </div>
    </>
  )
}
