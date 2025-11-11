import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { DietDay } from "@/app/(type)/diet";
import DietSquareItem from "../../../create/(Diet)/DietSquareItem";
import Link from "next/link";

export default async function BoardDietHolder({dietDays}:{dietDays:DietDay[]}){

    const dietDayItems = dietDays.map((dietDay, inx)=>
        <Link className="w-[150px] h-[150px] m-1 shrink-0" key={inx} href={`/diet/mydiet/${dietDay.dietDayId}`}>
            <DietSquareItem key={inx} dietDay={dietDay}/>
        </Link>
        )

    return (
        <Accordion defaultExpanded>
            <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header">
                <h2>식단</h2>
            </AccordionSummary>
            <AccordionDetails>
                <ul className="flex justify-start items-center w-full overflow-x-scroll">
                    {dietDayItems}
                </ul>
            </AccordionDetails>
        </Accordion>
    )
}