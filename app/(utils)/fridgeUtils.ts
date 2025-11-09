import { QueryClient } from "@tanstack/react-query";
import { defaultAxios } from "../(customAxios)/authAxios";
import { FridgeItem } from "../(type)/fridge";
import { fetchFridgeImages } from "../(api)/fridge";

export async function getImgUrlByIdRQ(
  qc: QueryClient,
  imgId: number
): Promise<string> {
  if (!Number.isFinite(imgId)) return "";

  // 1) 캐시 먼저 조회
  const cached = qc.getQueryData<FridgeItem[]>(["fridgeImages"]);
  if (Array.isArray(cached)) {
    const url = cached.find((it) => it.fridgeImgId === imgId)?.imgUrl;
    if (url) return url;
  }

  // 2) 버전에 따라 fetchQuery 호출 방식 분기
  let fresh: FridgeItem[];
  if (typeof (qc as any).fetchQuery === "function" && (qc as any).fetchQuery.length === 1) {
    // v5: options 객체로 호출
    fresh = await (qc as any).fetchQuery({
      queryKey: ["fridgeImages"],
      queryFn: fetchFridgeImages,
      staleTime: 5 * 60 * 1000,
    });
  } else {
    // @ts-expect-error: v4 signature
    fresh = await qc.fetchQuery(["fridgeImages"], fetchFridgeImages, {
      staleTime: 5 * 60 * 1000,
    });
  }

  return fresh.find((it) => it.fridgeImgId === imgId)?.imgUrl ?? "";
}