import { Recipe } from "@/app/(recipe)/types/recipeType"
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Link from "next/link";
import RecipeSquareItem from "../../../create/(Recipe)/RecipeSquareItem";

export default async function BoardRecipeHolder({recipes}:{recipes:Recipe[]}){

    const recipeItems = recipes.map((recipe, inx)=>
        <Link className="w-[150px] h-[150px] m-1" key={inx} href={`/recipe-detail/${recipe.recipeId}`}>
            <RecipeSquareItem recipe={recipe}/>
        </Link>
    );

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
                <ul className="flex justify-start items-center w-full overflow-x-scroll">
                    {recipeItems}
                </ul>
            </AccordionDetails>
        </Accordion>
    )
}