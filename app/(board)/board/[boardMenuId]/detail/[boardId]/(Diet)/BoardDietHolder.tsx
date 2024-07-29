import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { DietDay } from "@/app/(type)/diet";
import DietVerticalItem from "../../../create/(Diet)/DietVerticalItem";

export default async function BoardDietHolder({dietDays}:{dietDays:DietDay[]}){

    const dietDayProp = dietDays.map((dietDay, inx)=>
        <DietVerticalItem key={inx} dietDay={dietDay}/>)

    return (
        <Accordion defaultExpanded>
            <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header">
                <h2>식단</h2>
            </AccordionSummary>
            <AccordionDetails>
                <div className="flex justify-start items-center w-full overflow-x-scroll">
                    {dietDayProp}
                </div>
            </AccordionDetails>
        </Accordion>
    )
}