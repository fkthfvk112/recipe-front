import { Recipe } from "../../types/recipeType";

interface RecipeLayoutProp {
  recipeDatas: Recipe[];
}

export default function RecipeLayout({ recipeDatas }: RecipeLayoutProp) {
  console.log("레이아웃 - 패치데이터", recipeDatas); // 수정
  return <div>레이아웃</div>;
}
