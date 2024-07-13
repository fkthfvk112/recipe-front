"use client"
import { Box, Modal, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { axiosAuthInstacne } from "../(customAxios)/authAxios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

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
        withReactContent(Swal).fire({
            title:"저장하는 중...",
            showConfirmButton:false,
            allowOutsideClick:false,
            html:<div className="overflow-y-hidden"><CircularProgress /></div>
          })

        axiosAuthInstacne
            .post(postUrl, data)
            .then((res) => {
                Swal.fire({
                    title: "저장되었습니다!",
                    icon: "success",
                }).then(() => {
                    //   if(revalidateTagName){
                    //     console.log("리발리!!")
                    //     revalidateByTagName(revalidateTagName);
                    //   }
                    router.push(returnUrl)
                });
            })
            .catch((e) => {
                Swal.fire({
                    title: "에러가 발생하였습니다.",
                    icon: "error",
                  });
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
            <div className="mt-5">
                <button className="saveBtn me-1" onClick={handleSave}>
                    저장
                </button>
                <button className="grayBtn ms-1" onClick={()=>{
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