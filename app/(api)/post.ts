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

export async function fetchPostList() {
  const res = await axiosAuthInstacne.get(
    `post/list`
  );

  return res.data;
}

export async function updatePost(postId: number, payload: {
  title: string;
  content: string;
  slug: string;
  isDraft: boolean;
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