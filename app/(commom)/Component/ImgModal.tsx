"use client"
import { Box, Modal } from "@mui/material";
import Image from "next/image";
import { useEffect } from "react";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '95%',
    height: 'auto',
    maxWidth: '800px',
    aspectRatio: 1 / 1,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
};
export default function ImgModal({modalOpen, setModalOpen,modalImg}:{modalOpen:boolean, setModalOpen:(data:any)=>any, modalImg:string}){

    useEffect(()=>{
    }, [modalImg, modalOpen])
  
    return(
        modalOpen&&
    <Modal
        open={modalOpen}
        onClose={() => {
            setModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
            <Image className="inner-img" width={150} height={150} src={modalImg} alt="no imgage" onClick={()=>setModalOpen(false)}/>
        </Box>
    </Modal>
    )
}