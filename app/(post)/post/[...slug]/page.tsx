import serverFetch from "@/app/(commom)/serverFetch";
import { Metadata } from "next";
import Script from "next/script";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import { Components } from "react-markdown";
import Badge from "@/app/(commom)/Component/Badge";
import FallbackPage from "@/app/(commom)/Component/FallbackPage";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";

type Props = { params: { slug: string[] } };

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
  return match?.[1] ?? null;
}



async function getRelatedPosts(currentSlug: string): Promise<Post[]> {
  try {
    const data = await serverFetch({ url: "post/published", option: { cache: "no-store" } });
    if (!Array.isArray(data)) return [];
    return data.filter((p: Post) => p.slug !== currentSlug).slice(0, 3);
  } catch {
    return [];
  }
}

async function fetchPostBySlug(slugPath: string): Promise<Post | null> {
  try {
    const res = await serverFetch({
      url: "post/any/slug",
      queryParams: { slug: slugPath },
      option: { cache: "no-store" },
    });
    const post = res?.data ?? res;
    if (post && (post.title || post.postId)) return post;
  } catch {
    // fallback
  }
  try {
    const res = await serverFetch({
      url: "post/slug",
      queryParams: { slug: slugPath },
      option: { cache: "no-store" },
    });
    const post = res?.data ?? res;
    if (post && (post.title || post.postId)) return post;
  } catch {
    // fallback
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slugPath = Array.isArray(params?.slug) ? params.slug.join("/") : String(params?.slug ?? "");
  const post = await fetchPostBySlug(slugPath);
  const plainText = extractPlainText(post?.content ?? "");
  const coverImg = extractCoverImage(post?.content ?? "");

  return {
    title: post?.title ? `${post.title} - 머그인 식재료 백과` : "식재료 백과 - 머그인",
    description: plainText,
    openGraph: {
      title: post?.title || "",
      description: plainText,
      images: coverImg || "/common/favicon.png",
    },
    icons: { icon: "/common/favicon.png" },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/post/${slugPath}`,
    },
  };
}

// ─── 무채색 모노톤 정제 마크다운 커스텀 렌더러 ─────────────────────────────────────────
const markdownComponents: Components = {
  img: ({ src, alt, width, style }) => {
    let customWidth: string | undefined = typeof width === "string" || typeof width === "number" ? String(width) : undefined;
    
    // URL 해시 파라미터 파싱 (예: #w=300, #width=50%, #width=400px)
    if (src && src.includes("#")) {
      const hashPart = src.split("#")[1];
      const match = hashPart?.match(/(?:width|w)=([0-9]+%?|[0-9]+px)/i);
      if (match && match[1]) {
        customWidth = match[1].endsWith("%") || match[1].endsWith("px") ? match[1] : `${match[1]}px`;
      }
    }

    const imgStyle = {
      ...(style || {}),
      width: customWidth || (style?.width ? String(style.width) : "100%"),
      maxWidth: "100%",
    };

    return (
      <span className="block my-8 flex flex-col items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          style={imgStyle}
          className="rounded-2xl shadow-xs object-cover border border-gray-100/80 block mx-auto transition-all"
          loading="lazy"
        />
      </span>
    );
  },
  h1: ({ children }) => (
    <h2 className="text-2xl font-black text-gray-900 mt-10 mb-4 tracking-tight leading-snug">{children}</h2>
  ),
  h2: ({ children }) => (
    <h3 className="text-xl font-black text-gray-900 mt-8 mb-3 tracking-tight leading-snug">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="text-base font-extrabold text-gray-800 mt-6 mb-2">{children}</h4>
  ),
  blockquote: ({ children }) => (
    <blockquote className="bg-[#f3f4f6] border border-gray-200/60 rounded-[22px] p-6 my-6 text-gray-800 leading-relaxed font-normal shadow-2xs">
      {children}
    </blockquote>
  ),
  div: ({ children, className }) => {
    if (className === "callout-box" || className === "gray-box") {
      return (
        <div className="bg-[#f3f4f6] border border-gray-200/60 rounded-[22px] p-6 my-6 text-gray-800 leading-relaxed font-normal shadow-2xs">
          {children}
        </div>
      );
    }
    return <div>{children}</div>;
  },
  code: ({ children, className }) => {
    const isBlock = className?.startsWith("language-");
    return isBlock ? (
      <code className="block bg-neutral-900 text-gray-100 rounded-xl p-4 text-sm font-mono overflow-x-auto my-4">
        {children}
      </code>
    ) : (
      <code className="bg-gray-100 text-gray-800 rounded px-1.5 py-0.5 text-xs font-mono font-bold">
        {children}
      </code>
    );
  },
};

// ─── 연관 아티클 카드 (무채색 정돈) ──────────────────────────────────────────────────────
function RelatedPostCard({ post }: { post: Post }) {
  const plain = extractPlainText(post.content ?? "");
  const coverImg = extractCoverImage(post.content ?? "");
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200/70 hover:border-gray-400 hover:shadow-md transition-all"
    >
      {coverImg ? (
        <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverImg} alt={post.title ?? ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="w-full aspect-[16/9] bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold">식재료 아티클</div>
      )}
      <div className="p-4 flex flex-col gap-1.5">
        <h3 className="text-sm font-extrabold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
          {post.title}
        </h3>
        {plain && <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{plain}</p>}
      </div>
    </Link>
  );
}

export default async function PostLanding({ params }: Props) {
  const slugPath = Array.isArray(params?.slug) ? params.slug.join("/") : String(params?.slug ?? "");
  const post = await fetchPostBySlug(slugPath);

  if (!post) {
    return (
      <FallbackPage
        icon="📄"
        title="게시글이 존재하지 않습니다."
        description="요청하신 식재료 아티클이 존재하지 않거나 삭제되었습니다."
        primaryAction={{ label: "식재료 백과로 돌아가기", href: "/post" }}
      />
    );
  }

  const coverImg = extractCoverImage(post.content ?? "");
  const relatedPosts = await getRelatedPosts(slugPath);

  // 엔티티가 DB에서 받아온 순서 보장 태그 리스트 (운영 규약: 0번 인덱스 태그가 식재료명)
  const tags: string[] = Array.isArray(post?.tags) ? post.tags : [];
  const mainIngredientTag = tags.length > 0 ? tags[0] : "";

  const recipeSearchLink = mainIngredientTag
    ? `/recipes/1/ingredientNames=${encodeURIComponent(mainIngredientTag)}&servingsMin=1&servingsMax=20&sortingCondition=POPULARITY`
    : `/recipes/1/sortingCondition=POPULARITY`;
  const fridgeLink = `/fridge`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    articleBody: extractPlainText(post.content ?? ""),
    image: coverImg,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: "머그인" },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />

      <div className="min-h-screen bg-white pt-20">
        {/* ─── 커버 이미지 ─────────────────────────────────────────────── */}
        {coverImg && (
          <div className="w-full max-h-[380px] overflow-hidden bg-gray-50 border-b border-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImg}
              alt={post.title ?? "커버 이미지"}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
          {/* 브레드크럼 (무채색 릴렉스) */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-6">
            <Link href="/" className="hover:text-gray-700 transition-colors">홈</Link>
            <span>&rsaquo;</span>
            <Link href="/post" className="hover:text-gray-700 transition-colors">식재료 백과</Link>
            <span>&rsaquo;</span>
            <span className="text-gray-600 truncate max-w-[200px]">{post.title}</span>
          </nav>

          {/* ─── 아티클 헤더 (정돈된 차분한 톤) ────────────────────────────────── */}
          <header className="mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="gray" size="sm">
                식재료 노하우
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug mb-3">
              {post.title}
            </h1>
            {post.publishedAt && (
              <p className="text-xs text-gray-400 font-medium">
                {new Date(post.publishedAt).toLocaleDateString("ko-KR", {
                  year: "numeric", month: "long", day: "numeric"
                })}
              </p>
            )}
          </header>

          {/* ─── 아티클 본문 ─────────────────────────────────────────────── */}
          <article className="prose max-w-none w-full text-gray-800 prose-p:leading-relaxed prose-p:font-medium prose-p:text-gray-700 mb-10">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </article>

          {/* ─── 순백색 + 소프트 섀도우 액션 카트 (계층감 업) ────────────────── */}
          <div className="my-10 rounded-3xl bg-white border border-gray-100/90 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-6 sm:p-8">
            <p className="text-xs font-black text-emerald-600 mb-1.5 tracking-wider uppercase">이 식재료 활용법</p>
            <h2 className="text-lg sm:text-xl font-black mb-5 text-gray-900 tracking-tight">
              내 냉장고에 추가하고, 관련 레시피를 둘러보세요
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={fridgeLink}
                className="flex items-center justify-center gap-2 flex-1 px-5 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-2xl transition-all shadow-md"
              >
                내 냉장고에 추가
              </Link>
              <Link
                href={recipeSearchLink}
                className="flex items-center justify-center gap-2 flex-1 px-5 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-800 font-extrabold text-xs sm:text-sm rounded-2xl border border-gray-200/80 transition-all"
              >
                관련 레시피 구경하기
              </Link>
            </div>
          </div>

          {/* ─── DB 관련 태그 뱃지 영역 (함께 보면 좋은 이야기 바로 위) ────────────────── */}
          {tags.length > 0 && (
            <section className="mt-10 pt-6 border-t border-gray-200/80">
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 mb-3">
                <TagOutlinedIcon style={{ fontSize: 15 }} />
                <span>관련 태그:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-10">
                {tags.map((tag) => (
                  <Link key={tag} href={`/post/topic/${encodeURIComponent(tag)}`}>
                    <Badge
                      variant="gray"
                      size="md"
                      className="hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ─── 함께 보면 좋은 이야기 ────────────────────────────────────────── */}
          {relatedPosts.length > 0 && (
            <section className="pt-8 border-t border-gray-200/80">
              <h2 className="text-base sm:text-lg font-black text-gray-900 mb-4 tracking-tight">
                함께 보면 좋은 이야기
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedPosts.map((p, idx) => (
                  <RelatedPostCard key={p.postId ?? idx} post={p} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
