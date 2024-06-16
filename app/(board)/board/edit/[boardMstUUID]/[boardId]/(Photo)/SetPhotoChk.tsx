import React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PhotoHolder from "./PhotoHolderChk";
import PhotoHolderChk from "./PhotoHolderChk";

function SetDietWithChk({photos, setPhotos, setPhotoChangeChk}:{photos:File[], setPhotos:(files:File[])=>void, setPhotoChangeChk:(chk:boolean)=>void}){
    return (
        <Accordion>
            <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            >
            <h3>사진 등록(최대 3장)</h3>
            </AccordionSummary>
            <AccordionDetails>
                <PhotoHolderChk photos={photos} setPhotos={setPhotos} setPhotoChangeChk={setPhotoChangeChk}/>
            </AccordionDetails>
      </Accordion>
    )
}

export default React.memo(SetDietWithChk);