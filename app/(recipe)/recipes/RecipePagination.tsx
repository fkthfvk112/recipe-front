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
    <div>
      <Pagination
        onChange={handlePageChange}
        count={pageMax}
        defaultPage={pageNow}
      />
    </div>
  );
}
