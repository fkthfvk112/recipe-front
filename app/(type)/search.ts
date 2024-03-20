export interface RecipeSearchingCondition {
  recipeName: string | null;
  createdDate: Date | null;
  cookMethod: "굽기" | "볶기" | "삶기" | "찌기" | "튀기기" | null;
  ingredientNames: string[] | null;
  ingredientAndCon: boolean | null;
  servingCon: {
    min: number;
    max: number;
  } | null;
  cookCategory:
    | "한식"
    | "중식"
    | "양식"
    | "일식"
    | "분식"
    | "후식"
    | "건강식"
    | null;
}

export type sortingCondition =
  | "POPULARITY"
  | "LIKE_MANY"
  | "LIKE_FEW"
  | "VIEW_MANY"
  | "VIEW_FEW";
