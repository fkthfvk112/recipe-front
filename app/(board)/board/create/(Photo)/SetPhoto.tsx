import React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PhotoHolder from "./PhotoHolder";

function SetDiet({photos, setPhotos}:{photos:File[], setPhotos:(files:File[])=>void}){

    return (
        <Accordion>
            <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            >
            <div>사진 등록(최대 3장)</div>
            </AccordionSummary>
            <AccordionDetails>
                <PhotoHolder photos={photos} setPhotos={setPhotos}/>
            </AccordionDetails>
      </Accordion>
    )
}

export default React.memo(SetDiet);