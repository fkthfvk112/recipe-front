"use server";

import serverFetch from "@/app/(commom)/serverFetch";
import { Metadata } from "next";
import Script from "next/script";
import ReactMarkdown from "react-markdown";

type Props = { params: { slug:  string[]; } };

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
      description:plainText,
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
  if (!post) return <div className="defaultInnerContainer">게시글을 찾을 수 없습니다.</div>;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    articleBody: post.content
      .replace(/[#>*_\-\[\]()`]/g, "")
      .replace(/\n+/g, " ")
      .slice(0, 300),
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
    <section className="defaultInnerContainer" style={{paddingLeft:'1rem', marginTop:'2.5rem', paddingRight:'1rem'}}>
      <h1 className="text-xl font-bold mb-3">{post.title}</h1>
      <hr className="mb-6"/>
        <article className="prose 
          prose-headings:mb-2
          prose-p:mt-0
          prose-p:mb-4
          max-w-none
          w-full">
        <ReactMarkdown>
          {post.content}
        </ReactMarkdown>
      </article>
    </section>
    </>
  );
}
