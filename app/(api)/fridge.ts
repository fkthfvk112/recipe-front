import { axiosAuthInstacne, defaultAxios } from "@/app/(customAxios)/authAxios";
import type { FridgeItem, FridgeSortingEnum } from "@/app/(type)/fridge";
import { PresetCreateRequest } from "../admin/fridge-preset/PresetCreatePage";
import { PresetUpdateRequest } from "../admin/fridge-preset/edit/[presetId]/PresetUpdatePage";

export async function fetchFridgeImages(): Promise<FridgeItem[]> {
  const res = await defaultAxios.get<FridgeItem[]>("fridge/images");
  return Array.isArray(res.data) ? res.data : [];
}

export async function createFridgePreset(payload: PresetCreateRequest) {
  const res = await axiosAuthInstacne.post("fridge/preset", payload);
  return res.data;
}

export async function updateFridgePreset(payload: PresetUpdateRequest) {
  const res = await axiosAuthInstacne.put(`/fridge/preset`, payload);
  return res.data;
}

export async function fetchFridgeDetail(fridgeId: number, fridgeSort: FridgeSortingEnum) {
  const res = await axiosAuthInstacne.get(
    `fridge/my/detail?fridgeId=${fridgeId}&sortingEnum=${fridgeSort}`
  );
  return res.data;
}

export async function fetchFridgeItemDetail(fridgeItemId: number) {
  const res = await axiosAuthInstacne.get(
    `fridge/my/fridge-item/detail?fridgeItemId=${fridgeItemId}`
  );

  return res.data;
}