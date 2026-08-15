"use client";

import { Pagination } from "@mui/material";
import { useRouter } from "next/navigation";

export default function PostPagination({
  pageNow,
  pageMax,
  topic,
}: {
  pageNow: number;
  pageMax: number;
  topic?: string;
}) {
  const router = useRouter();

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const query = new URLSearchParams();
    if (topic) query.set("topic", topic);
    query.set("page", String(value));
    router.push(`/post?${query.toString()}`);
  };

  if (pageMax < 1) return null;

  return (
    <div className="flex justify-center w-full my-10">
      <Pagination
        size="medium"
        onChange={handlePageChange}
        count={pageMax}
        defaultPage={pageNow}
        page={pageNow}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
          marginBottom: "2rem",
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
