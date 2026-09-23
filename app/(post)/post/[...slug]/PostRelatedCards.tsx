"use client";

import Link from "next/link";
import { sendGA4Event } from "@/app/(commom)/ga4/ga4Events";

interface Post {
  postId?: number;
  title?: string;
  content?: string;
  slug?: string;
}

function extractPlainText(markdown: string): string {
  return markdown
    ?.replace(/!\[.*?\]\(.*?\)/g, "")
    ?.replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
    ?.replace(/[#>*_\-`]/g, "")
    ?.replace(/\n+/g, " ")
    ?.trim()
    ?.slice(0, 150) ?? "";
}

function extractCoverImage(markdown: string): string | null {
  const match = markdown?.match(/!\[.*?\]\((.*?)\)/);
  if (!match?.[1]) return null;
  const rawUrl = match[1].split("#")[0].trim();
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) return rawUrl;
  return null;
}

interface PostRelatedCardsProps {
  posts: Post[];
  currentPostTitle: string;
}

export default function PostRelatedCards({ posts, currentPostTitle }: PostRelatedCardsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="pt-8 border-t border-gray-200/80">
      <h2 className="text-base sm:text-lg font-black text-gray-900 mb-4 tracking-tight">
        함께 보면 좋은 이야기
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {posts.map((post, idx) => {
          const plain = extractPlainText(post.content ?? "");
          const coverImg = extractCoverImage(post.content ?? "");

          return (
            <Link
              key={post.postId ?? idx}
              prefetch={false}
              href={`/post/${post.slug}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200/70 hover:border-gray-400 hover:shadow-md transition-all"
              onClick={() =>
                sendGA4Event("post_related_click", {
                  clicked_post_title: post.title ?? "",
                  clicked_post_slug: post.slug ?? "",
                  source_post_title: currentPostTitle,
                  position: idx + 1,
                })
              }
            >
              {coverImg ? (
                <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImg}
                    alt={post.title ?? ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[16/9] bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold">
                  식재료 아티클
                </div>
              )}
              <div className="p-4 flex flex-col gap-1.5">
                <h3 className="text-sm font-extrabold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
                  {post.title}
                </h3>
                {plain && (
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{plain}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
