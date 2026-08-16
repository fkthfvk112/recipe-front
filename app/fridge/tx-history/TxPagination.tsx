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

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (pageMax <= 1) return null;

  return (
    <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
      <Pagination
        size="medium"
        count={pageMax}
        page={pageNow}
        onChange={handlePageChange}
        sx={{
          display: "flex",
          justifyContent: "center",
          "& .MuiPaginationItem-root": {
            borderRadius: "50%",
            fontWeight: "bold",
            color: "#4B5563",
            border: "1px solid transparent",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              borderColor: "#10B981",
              color: "#10B981",
            },
          },
          "& .Mui-selected": {
            backgroundColor: "#10B981 !important",
            color: "#FFFFFF !important",
            boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2), 0 2px 4px -1px rgba(16, 185, 129, 0.1)",
          },
        }}
      />
    </div>
  );
}
