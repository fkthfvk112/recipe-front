import { axiosAuthInstacne } from "../(customAxios)/authAxios";
import { FetchTxHistoryParams, FridgeItemTxHistoryResponse, FridgeItemTxRow } from "../(type)/fridge";

export async function fetchFridgeTxHistory(
  params: FetchTxHistoryParams
): Promise<FridgeItemTxHistoryResponse> {
  const res = await axiosAuthInstacne.post(
    "fridge/item/tx/search",
    { ...params }
  );

  return res.data;
}