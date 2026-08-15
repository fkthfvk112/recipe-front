"use server";

import serverFetch from "@/app/(commom)/serverFetch";
import { Metadata } from "next";
import Script from "next/script";
import ReactMarkdown from "react-markdown";

type Props = { params: { slug: string[]; } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slugPath = params.slug.join("/");
  const post = await serverFetch({ url: "post/slug", queryParams: { slug: slugPath } });

  const plainText = post?.content
    ?.replace(/[#>*_\-\[\]()`]/g, "")
    ?.replace(/\n+/g, " ")
    ?.slice(0, 150);

  return {
    title: post?.title ? `${post.title} - 머그인` : "게시글 - 머그인",
    description: post?.content || "",
    openGraph: {
      title: post?.title || "",
      description: plainText,
      images: "/common/favicon.png",
    },
    icons: { icon: "/common/favicon.png" },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/post/${slugPath}`,
    }
  };
}

export default async function PostLanding({ params }: Props) {
  const slugPath = params.slug.join("/");
  const post = await serverFetch({ url: "post/slug", queryParams: { slug: slugPath } });

  if (!post) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-20 text-center text-gray-400 font-medium text-sm">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    articleBody: post.content
      ?.replace(/[#>*_\-\[\]()`]/g, "")
      ?.replace(/\n+/g, " ")
      ?.slice(0, 300),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: "머그인",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/post/${slugPath}`,
    },
  };

  return (
    <>
      <Script
        id="post-blogposting-ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema),
        }}
      />
      <main className="w-full max-w-3xl mx-auto px-4 py-8 bg-white min-h-screen text-left">
        {/* Post Title & Metadata Header */}
        <header className="border-b border-gray-100 pb-5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 mb-3">
            {/* <span>아티클</span> have to :: 식재료명으로*/}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
            {post.title}
          </h1>
        </header>

        {/* Post Content */}
        <article className="prose prose-emerald max-w-none w-full text-gray-800 text-sm sm:text-base leading-relaxed prose-headings:font-black prose-p:font-medium prose-p:text-gray-700 prose-img:rounded-2xl">
          <ReactMarkdown>
            {post.content}
          </ReactMarkdown>
        </article>
      </main>
    </>
  );
}
