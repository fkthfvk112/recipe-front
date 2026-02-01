"use client";

import { Pagination } from "@mui/material";

export default function TxPagination({
  pageNow,
  totalCnt,
  setPage,
}: {
  pageNow: number;
  totalCnt: number;
  setPage: (p: number) => void;
}) {
  const pageMax = Math.ceil(totalCnt / 10);

  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <div className="flex justify-center my-4">
      <Pagination
        size="small"
        count={pageMax}
        page={pageNow}
        onChange={handlePageChange}
      />
    </div>
  );
}
