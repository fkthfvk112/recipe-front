export enum RecipeSelection {
  한식 = "한식",
  양식 = "양식",
  중식 = "중식",
  일식 = "일식",
  후식 = "후식",
  건강식 = "건강식",
  분식 = "분식",
  기타 = "기타",
}

export enum CookingMethod {
  굽기 = "굽기",
  튀기기 = "튀기기",
  삶기 = "삶기",
  찌기 = "찌기",
  볶기 = "볶기",
  기타 = "기타",
}

export interface CookingSteps_create {
  order:       number;
  photo:       string | null;
  description: string;
  time:        number;
}

export interface CookingSteps_show {
  order:       number;
  photo:       string | null;
  description: string;
  time:        number;
}

export interface Ingredient {
  name:        string;
  qqt:         string;
  order:       number;
}

export interface Recipe {
  createdAt:    string;
  viewCnt:      number;
  recipeId:     number | undefined | null;
  recipeName:   string;
  repriPhotos:  string[];
  categorie:    RecipeSelection;
  servings:     number;
  cookMethod:   CookingMethod;
  ingredients:  Ingredient[];
  description:  string;
  steps:        CookingSteps_create[] | CookingSteps_show[];
  reviewCnt?:   number;
  likeCnt?:     number;
  reviewAvg?:     number;
}
