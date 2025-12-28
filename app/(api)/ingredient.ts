// /api/ingredient.ts
import { defaultAxios } from "@/app/(customAxios)/authAxios";

export type IngredientListItem = {
  ingreListId: number;
  name: string;
};

export async function fetchIngredients(): Promise<IngredientListItem[]> {
  const res = await defaultAxios.get<IngredientListItem[]>("ingre-list/all");
  return res.data;
}
