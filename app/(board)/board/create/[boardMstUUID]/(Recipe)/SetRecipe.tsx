import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import React, { useState } from "react";
import RecipeFinderModal from "./RecipeFinderModal";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import RecipeCard from "@/app/(commom)/RecipeCard";

function SetRecipe({recipes, setRecipes}:{recipes:Recipe[], setRecipes:(recipes:Recipe[])=>void}){

    const recipeCardComps = recipes.map((ele, inx)=>{
        return <RecipeCard key={inx} recipe={ele}/>
    })

    return (
        <Accordion>
            <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            >
            <h3>레시피</h3>
            </AccordionSummary>
            <AccordionDetails>
                <RecipeFinderModal recipes={recipes} setRecipes={setRecipes}/>
            </AccordionDetails>
      </Accordion>
    )
}

export default React.memo(SetRecipe);