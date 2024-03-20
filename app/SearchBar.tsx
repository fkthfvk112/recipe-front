"use client";

import SearchIcon from "@mui/icons-material/Search";
import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react";
import DetailSearchingModal from "./DetailSearchingModal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function SearchBar() {
  const [searchingData, setSearchingData] = useState<string>("");

  const [isOpen, setIsOpen] = useState(false);
  //   const handleOpen = () => setOpen(true);
  //   const handleClose = () => setOpen(false);

  console.log(searchingData);
  return (
    <div className="p-2 w-full text-center">
      <input
        onChange={(evt) => {
          setSearchingData(evt.target.value);
        }}
        value={searchingData}
        className="max-w-96"
        type="text"
      ></input>
      <button>
        <SearchIcon />
      </button>
      <button onClick={() => setIsOpen(true)}>상세 검색</button>
      <DetailSearchingModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      ></DetailSearchingModal>
      {/* <button onClick={handleOpen}>상세 보기</button> */}
    </div>
  );
}
