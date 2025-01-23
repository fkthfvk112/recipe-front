"use client"

import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Image from "next/image";
import ImgModal from "@/app/(commom)/Component/ImgModal";
import { useState } from "react";

export default function BoardPhotoHolder({imgUrls}:{imgUrls:string[]}){
    const [modalImg, setModalImg]  = useState<string>("");
    const [modalOpen, openImgModal] = useState<boolean>(false);

    const clickImgModalOpen = (imgStr:string)=>{
        setModalImg(imgStr);
        openImgModal(true);
    }

    const images = imgUrls.map((imgUrl, inx)=>{
        return(
            <li key={inx} className="m-1 relative border rounded-xl min-w-[150px] min-h-[150px] w-[150px] h-[150px]">
                <Image className="inner-img border" src={imgUrl} height={120} width={120}  alt="no imgage"
                    onClick={()=>clickImgModalOpen(imgUrl)}/>
            </li>
        )
    })
    return (
        <Accordion defaultExpanded>
            <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header">
                <h2>사진</h2>
            </AccordionSummary>
            <AccordionDetails>
                <ul className="flex justify-start items-center w-full overflow-x-scroll">
                    {images}
                </ul>
            </AccordionDetails>
        <ImgModal modalOpen={modalOpen} setModalOpen={openImgModal} modalImg={modalImg}/>
        </Accordion>
    )
}