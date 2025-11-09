import { defaultAxios } from "@/app/(customAxios)/authAxios";
import type { FridgeItem } from "@/app/(type)/fridge";

export async function fetchFridgeImages(): Promise<FridgeItem[]> {
  const res = await defaultAxios.get<FridgeItem[]>("fridge/images");
  return Array.isArray(res.data) ? res.data : [];
}