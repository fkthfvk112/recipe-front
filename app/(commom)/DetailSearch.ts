import { RecipeSearchingCondition, sortingCondition } from "../(type)/search";

export const searchingConToQueryString = (
  searchingCon: RecipeSearchingCondition,
  sortingCon: sortingCondition
): string => {
  const {
    recipeName,
    createdDate,
    cookMethod,
    ingredientNames,
    ingredientAndCon,
    servingCon,
    cookCategory,
  } = searchingCon;

  let queryStr = "";

  if (recipeName !== null) {
    queryStr += `&recipeName=${encodeURIComponent(recipeName)}`;
  }

  if (createdDate !== null) {
    queryStr += `&createdDate=${encodeURIComponent(createdDate.toString())}`;
  }

  if (cookMethod !== null) {
    queryStr += `&cookMethod=${encodeURIComponent(cookMethod)}`;
  }

  if (ingredientNames !== null) {
    if (Array.isArray(ingredientNames)) {
      ingredientNames.forEach((ele) => {
        queryStr += `&ingredientNames=${encodeURIComponent(ele)}`;
      });
    }
  }
  if (ingredientAndCon !== null) {
    queryStr += `&ingredientAndCon=${encodeURIComponent(
      ingredientAndCon.toString()
    )}`;
  }
  if (servingCon !== null) {
    const minStr = servingCon.min.toString();
    const maxStr = servingCon.max.toString();
    queryStr += `&servingsMin=${minStr}&servingsMax=${maxStr}`;
  }
  if (cookCategory !== null) {
    queryStr += `&cookCategory=${encodeURIComponent(cookCategory)}`;
  }
  if (sortingCon !== null) {
    queryStr += `&sortingCondition=${encodeURIComponent(sortingCon)}`;
  }

  if (queryStr.charAt(0) === "&") {
    queryStr = queryStr.substring(1);
  }

  return queryStr;
};
