"use client";
import { Pagination } from "@mui/material";
import { useRouter } from "next/navigation";

export default function RecipePagination({
  queryStr,
  pageNow,
  pageMax,
}: {
  queryStr: string;
  pageNow: number;
  pageMax: number;
}) {
  const router = useRouter();
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    router.push(`/recipes/${value}/${queryStr}`);
  };


  return (
    <div className="flex justify-center items-center mt-10 w-full">
      <Pagination
        onChange={handlePageChange}
        count={pageMax}
        defaultPage={pageNow}
      />
    </div>
  );
}
