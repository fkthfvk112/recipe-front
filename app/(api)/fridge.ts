import { axiosAuthInstacne, defaultAxios } from "@/app/(customAxios)/authAxios";
import type {
  FridgeItem,
  FridgeSortingEnum,
  FridgeAiScanResponse,
  FridgeSaveDTOList_IN,
} from "@/app/(type)/fridge";
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
  const sortVal = typeof fridgeSort === "number" ? fridgeSort : Number(fridgeSort ?? 0);
  const res = await axiosAuthInstacne.get(
    `fridge/my/detail?fridgeId=${fridgeId}&sortingEnum=${sortVal}`
  );
  return res.data;
}

export async function fetchFridgeItemDetail(fridgeItemId: number) {
  const res = await axiosAuthInstacne.get(
    `fridge/my/fridge-item/detail?fridgeItemId=${fridgeItemId}`
  );

  return res.data;
}

export async function scanReceiptOrImage(formData: FormData): Promise<FridgeAiScanResponse> {
  const res = await axiosAuthInstacne.post<FridgeAiScanResponse>("fridge/ai/scan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function saveFridgeItemsBulk(payload: FridgeSaveDTOList_IN) {
  const res = await axiosAuthInstacne.post("fridge/my/fridge-items/bulk", payload);
  return res.data;
}