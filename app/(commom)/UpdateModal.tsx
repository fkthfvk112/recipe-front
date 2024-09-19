"use client"
import { Box, Modal } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { axiosAuthInstacne } from "../(customAxios)/authAxios";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '95%',
    maxWidth:450,
    minWidth:280,
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

function UpdateModal<T>({ open, setOpen, content, data, postUrl, returnUrl}: SaveModalProp<T>) {
    const router = useRouter();
    const handleSave = ()=>{
        if(postUrl === undefined || postUrl === "" || data === undefined || data === null) return;

        axiosAuthInstacne
            .put(postUrl, data)
            .then((res) => {
                alert("수정되었습니다!");
                router.push(returnUrl);
                router.refresh();
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
            <div className="w-full p-3 text-xl font-bold text-[#3d3d3d]">
                {content}
            </div>
            <div className="w-full text-center mt-6">
                <button className="greenBtn me-1" onClick={handleSave}>
                    수정하기
                </button>
                <button className="cancelBtn ms-1" onClick={()=>{
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

export default  React.memo(UpdateModal);