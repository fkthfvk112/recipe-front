"use client"
import { Box, Modal } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { axiosAuthInstacne } from "../(customAxios)/authAxios";

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

interface SaveModalProp<T>{
    open:boolean,
    setOpen:(open:boolean)=>void,
    content:string,
    data:T,
    postUrl:string,
    returnUrl:string
};

function SaveModal<T>({ open, setOpen, content, data, postUrl, returnUrl}: SaveModalProp<T>) {
    const router = useRouter();
    const handleSave = ()=>{
        console.log("세이브 데이터", data);
        if(postUrl === undefined || postUrl === "" || data === undefined || data === null) return;

        axiosAuthInstacne
            .post(postUrl, data)
            .then((res) => {
                console.log("save !!!")
                alert("저장되었습니다!");
                router.push(returnUrl);
            })
            .catch((e) => {
                alert(`에러가 발생하였습니다. ${e.data}`);
            });
    }

    return(
        <Modal
        open={open}
        onClose={() => {
            setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="text-center">
            <div className="w-full p-3">
                {content}
            </div>
            <div>
                <button onClick={handleSave}>
                    저장
                </button>
                <button onClick={()=>{
                    setOpen(false);
                }}>
                    취소
                </button>
            </div>
          </div>
        </Box>
      </Modal>
    )
}

export default  React.memo(SaveModal);