"use client";
import { SetStateAction, useEffect, useState } from "react";
import { RecipeCreate } from "./page";

export default function ErrorText({
  recipe,
  setErrorCnt,
}: {
  recipe: RecipeCreate;
  setErrorCnt: React.Dispatch<SetStateAction<number>>;
}) {
  const [errorTextComp, setErrorTextComp] = useState<React.ReactNode>(<></>);


  useEffect(() => {
    let errCnt = 0;
    let errorText: React.ReactNode = <> </>;

    if (recipe.recipeName.length < 1 || recipe.recipeName.length > 60) {
      errCnt++;
      errorText = (
        <>
          <div className="text-base">
            레시피 이름을 추가해주세요 (1글자 이상, 60글자 이하)
          </div>
        </>
      );
    }
  
    if (recipe.repriPhotos.filter((photo)=>photo!==""&&photo.length>10).length < 1) {
      errCnt++;
      errorText = (
        <>
          {errorText}
          <div className="text-base">
            레시피 대표사진을 추가해주세요. (1개 이상)
          </div>
        </>
      );
    }
  
    if (recipe.description.length < 3 || recipe.description.length > 200) {
      errCnt++;
      errorText = (
        <>
          {errorText}
          <div className="text-base">레시피 설명을 추가해주세요. (3글자 이상)</div>
        </>
      );
    }
  
    if (recipe.ingredients.length <= 0) {
      errCnt++;
      errorText = (
        <>
          {errorText}
          <div className="text-base">
            레시피 재료를 입력해주세요. (재료명, 수량)
          </div>
        </>
      );
    }
  
    if (
      recipe.steps.length < 3 ||
      recipe.steps.find((step) => step.description.length < 3)
    ) {
      errCnt++;
      errorText = (
        <>
          {errorText}
          <div className="text-base">
            레시피 단계를 추가해주세요(3단계 이상, 각 3글자 이상)
          </div>
        </>
      );
    }

    setErrorCnt(errCnt);
    setErrorTextComp(errorText);
    
  }, [recipe, setErrorCnt]); 


  return <div className="mt-3 mb-3">{errorTextComp}</div>;
}
