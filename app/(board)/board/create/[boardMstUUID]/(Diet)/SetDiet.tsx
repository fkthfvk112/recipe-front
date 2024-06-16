import React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { DietDay } from "@/app/(type)/diet";
import DietFinderModal from "./DietFinderModal";

function SetDiet({dietDay, setDietDay}:{dietDay:DietDay[], setDietDay:(diet:DietDay[])=>void}){

    return (
        <Accordion>
            <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            >
            <h3>식단(최대 6)</h3>
            </AccordionSummary>
            <AccordionDetails>
                <DietFinderModal dietDay={dietDay} setDietDay={setDietDay}/>
            </AccordionDetails>
      </Accordion>
    )
}

export default React.memo(SetDiet);