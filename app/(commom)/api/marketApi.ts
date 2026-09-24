import { defaultAxios } from "@/app/(customAxios)/authAxios";

/**
 * 마켓 / 커머스 (쿠팡 파트너스 등) API 엔드포인트 정의
 */
export const MARKET_ENDPOINTS = {
  /** 특정 식재료 키워드의 쿠팡 파트너스 랜딩 URL 조회 */
  GET_LANDING_URL: "/market/landing-url",
  /** 상품 검색 정보 조회 */
  PRODUCT_SEARCH: "/market/product/search",
} as const;

/**
 * 마켓 관련 API 서비스 함수 모음
 */
export const marketApi = {
  /**
   * 특정 식재료/상품 키워드의 쿠팡 파트너스 랜딩 URL 조회
   * @param productName 검색할 상품/식재료명
   */
  getLandingUrl: (productName: string) => {
    return defaultAxios.get<string>(MARKET_ENDPOINTS.GET_LANDING_URL, {
      params: { product: productName },
    });
  },
};
