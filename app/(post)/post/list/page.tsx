"use server";

import serverFetch from "@/app/(commom)/serverFetch";
import Link from "next/link";

export default async function PostList() {
  const postList = await serverFetch({ url: "post/list", option: { next: { revalidate: 3600 } } });

  if (!postList || postList.length === 0) return <div className="defaultInnerContainer py-10">게시글이 없습니다.</div>;

  return (
    <section className="defaultInnerContainer py-10 px-5">
      <h1 className="text-2xl font-bold mb-5">포스팅</h1>
      <ul className="flex flex-col gap-4">
        {postList.map((post: any) => (
          <li key={post.postId} className="border p-4 rounded shadow hover:bg-gray-50 transition">
            <Link href={`/post/${post.slug}`}>
              <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
              <p className="text-gray-700 text-sm line-clamp-3">{post.content}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
