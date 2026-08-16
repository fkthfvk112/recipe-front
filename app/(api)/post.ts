import { axiosAuthInstacne } from "../(customAxios)/authAxios";

export async function fetchAnyPostDetail(slug: string) {
  const res = await axiosAuthInstacne.get(
    `post/any/slug?slug=${slug}`
  );

  return res.data;
}

export async function fetchPostDetailById(postId: string) {
  const res = await axiosAuthInstacne.get(
    `post/${postId}`
  );

  return res.data;
}

/** 관리자 - 전체 포스트 목록 */
export async function fetchPostList() {
  const res = await axiosAuthInstacne.get(
    `post/list`
  );

  return res.data;
}

/** 일반 사용자 - 발행된 포스트 목록 (공개) */
export async function fetchPublishedPostList(params?: {
  page?: number;
  size?: number;
  keyword?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page !== undefined) query.set("page", String(params.page));
  if (params?.size !== undefined) query.set("size", String(params.size));
  if (params?.keyword) query.set("keyword", params.keyword);

  const res = await axiosAuthInstacne.get(`post/published?${query.toString()}`);
  return res.data; // Post[]
}

export async function updatePost(postId: number, payload: {
  title: string;
  content: string;
  slug: string;
  isDraft: boolean;
  tags?: string[];
}) {
  const res = await axiosAuthInstacne.put(
    "post/update",
    {
      postId,
      ...payload,
    }
  );
  return res.data;
}

/**
 * AI 게시글 생성 (ADMIN)
 */
export async function generatePostByAI(ingredient: string) {
  const res = await axiosAuthInstacne.post(
    "post/ai",
    {
      ingredient,
    }
  );

  return res.data; // CRUDStateEnum
}

/**
 * 직접 게시글 작성 초안 생성 (ADMIN)
 */
export async function createDirectPost(payload?: { title?: string; content?: string; slug?: string; tags?: string[] }) {
  const res = await axiosAuthInstacne.post("post/create", payload ?? {});
  return res.data; // PostDTO
}

/**
 * 게시글 이미지 업로드 (ADMIN)
 * 백엔드가 준비되기 전까지는 공통 이미지 업로드 API 활용
 */
export async function uploadPostImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosAuthInstacne.post("post/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // 백엔드 응답: { url: "https://..." } 형태 예상
  return res.data?.url ?? res.data;
}

/**
 * AI 단일 이미지 생성 (ADMIN)
 */
export async function generateAiImage(prompt: string): Promise<string> {
  const res = await axiosAuthInstacne.post("post/ai/image", { prompt });
  return res.data?.url ?? "";
}