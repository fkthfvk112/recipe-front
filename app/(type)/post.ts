interface Post {
  postId: number;
  title: string;
  content: string;
  slug: string;
  draft: boolean;
  viewCnt: number;
  publishedAt?: string;
  updatedAt?: string;
  tags?:string[];
}