"use client";
import { SetStateAction } from "react";
import { Recipe } from "../types/recipeType";

export default function ErrorText({
  recipe,
  setErrorCnt,
}: {
  recipe: Recipe;
  setErrorCnt: React.Dispatch<SetStateAction<number>>;
}) {
  let errorText: React.ReactNode = <> </>;

  let errCnt = 0;
  if (recipe.recipeName.length < 3 || recipe.recipeName.length > 20) {
    errCnt++;
    errorText = (
      <>
        <div className="text-base">
          요리 이름을 추가해주세요 (3글자 이상, 20글자 이하)
        </div>
      </>
    );
  }

  if (recipe.repriPhotos.length <= 1) {
    errCnt++;
    errorText = (
      <>
        {errorText}
        <div className="text-base">
          요리 대표사진을 추가해주세요. (1개 이상)
        </div>
      </>
    );
  }

  if (recipe.description.length < 8) {
    errCnt++;
    errorText = (
      <>
        {errorText}
        <div className="text-base">요리 설명을 추가해주세요. (8글자 이상)</div>
      </>
    );
  }

  if (recipe.ingredients.length <= 0) {
    errCnt++;
    errorText = (
      <>
        {errorText}
        <div className="text-base">
          요리 재료를 입력해주세요. (재료명, 수량)
        </div>
      </>
    );
  }

  if (
    recipe.steps.length < 3 ||
    recipe.steps.find((step) => step.description.length < 5)
  ) {
    errCnt++;
    errorText = (
      <>
        {errorText}
        <div className="text-base">
          요리 단계를 추가해주세요(3단계 이상, 각 5글자 이상)
        </div>
      </>
    );
  }
  setErrorCnt(errCnt);

  return <div className="mt-3 mb-3">{errorText}</div>;
}
