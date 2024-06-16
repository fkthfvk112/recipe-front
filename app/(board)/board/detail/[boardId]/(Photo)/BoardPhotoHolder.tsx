import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Image from "next/image";

export default async function BoardPhotoHolder({imgUrls}:{imgUrls:string[]}){

    const images = imgUrls.map((imgUrl, inx)=>{
        return(
            <div key={inx} className="m-1 relative border rounded-xl min-w-[120px] min-h-[120px] w-[120px] h-[120px]">
                <Image className="inner-img border" src={imgUrl} height={120} width={120}  alt="no imgage"/>
            </div>
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
                <div className="flex justify-start items-center w-full overflow-x-scroll">
                    {images}
                </div>
            </AccordionDetails>
        </Accordion>
    )
}