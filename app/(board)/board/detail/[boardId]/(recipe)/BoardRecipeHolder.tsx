import { Recipe } from "@/app/(recipe)/types/recipeType"
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RecipeVerticalItem from "../../../create/[boardMstUUID]/(Recipe)/RecipeVerticalItem";

export default async function BoardRecipeHolder({recipes}:{recipes:Recipe[]}){

    const recipeProps = recipes.map((recipe, inx)=>
        <RecipeVerticalItem key={inx} recipe={recipe}/>);


    return (
        <Accordion defaultExpanded>
            <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            >
            <h2>레시피</h2>
            </AccordionSummary>
            <AccordionDetails>
                <div className="flex justify-start items-center w-full overflow-x-scroll">
                    {recipeProps}
                </div>
            </AccordionDetails>
        </Accordion>
    )
}