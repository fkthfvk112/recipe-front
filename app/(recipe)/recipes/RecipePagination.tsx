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
      <Pagination
        size="medium"
        onChange={handlePageChange}
        count={pageMax}
        defaultPage={pageNow}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2rem',
          marginBottom: '2rem',
          '& .MuiPaginationItem-root': {
            borderRadius: '50%',
            fontWeight: 'bold',
            color: '#4B5563',
            border: '1px solid transparent',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(255, 112, 67, 0.08)',
              borderColor: '#FF7043',
              color: '#FF7043',
            },
          },
          '& .Mui-selected': {
            backgroundColor: '#FF7043 !important',
            color: '#FFFFFF !important',
            boxShadow: '0 4px 6px -1px rgba(255, 112, 67, 0.2), 0 2px 4px -1px rgba(255, 112, 67, 0.1)',
          },
        }}
      />
  );
}
