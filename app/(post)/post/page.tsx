export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Metadata } from "next";
import serverFetch from "@/app/(commom)/serverFetch";
import Link from "next/link";
import Badge from "@/app/(commom)/Component/Badge";
import FallbackPage from "@/app/(commom)/Component/FallbackPage";
import PostPagination from "./PostPagination";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CloseIcon from "@mui/icons-material/Close";

export const metadata: Metadata = {
  title: "식재료 백과 - 머그인",
  description: "신선한 식재료의 선택법, 보관법, 영양 정보를 한 곳에서. 머그인 식재료 백과에서 다양한 식재료 이야기를 만나보세요.",
  openGraph: {
    title: "식재료 백과 - 머그인",
    description: "신선한 식재료의 선택법, 보관법, 영양 정보를 한 곳에서.",
    images: "/common/favicon.png",
  },
};

interface Post {
  postId?: number;
  title?: string;
  content?: string;
  slug?: string;
  publishedAt?: string;
  tags?: string[];
}

interface SpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

/**
 * 공개 게시글 페이징 조회
 */
async function getPublishedPostPage(page: number, size: number = 9): Promise<SpringPage<Post> | null> {
  try {
    const res = await serverFetch({
      url: "post/published/page",
      queryParams: { page, size },
      option: { cache: "no-store" },
    });
    if (res?.content && Array.isArray(res.content)) return res;
    if (res?.data?.content && Array.isArray(res.data.content)) return res.data;
  } catch {
    // fallback to old published endpoint
  }

  try {
    const res = await serverFetch({
      url: "post/published",
      option: { cache: "no-store" },
    });
    const list: Post[] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
    if (list.length > 0) {
      const startIndex = (page - 1) * size;
      const paginatedContent = list.slice(startIndex, startIndex + size);
      const totalPages = Math.ceil(list.length / size) || 1;
      return {
        content: paginatedContent,
        totalPages,
        totalElements: list.length,
        number: page - 1,
      };
    }
  } catch {
    // fallback
  }

  return null;
}

/**
 * 특정 태그로 공개 게시글 조회
 */
async function getPublishedPostsByTopic(topic: string): Promise<Post[]> {
  try {
    const res = await serverFetch({
      url: "post/topic",
      queryParams: { tag: topic },
      option: { cache: "no-store" },
    });
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
    return [];
  } catch {
    return [];
  }
}

/**
 * 인기 태그 조회 (Next.js 1시간 서버 캐시 revalidate: 3600 적용)
 */
async function getPopularTags(): Promise<string[]> {
  try {
    const data = await serverFetch({
      url: "post/popular-tags",
      queryParams: { limit: 10 },
      option: { next: { revalidate: 3600 } },
    });
    if (Array.isArray(data)) return data;
    return [];
  } catch {
    return [];
  }
}

function extractPlainText(markdown: string): string {
  return markdown
    ?.replace(/!\[.*?\]\(.*?\)/g, "")
    ?.replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
    ?.replace(/[#>*_\-`]/g, "")
    ?.replace(/\n+/g, " ")
    ?.trim()
    ?.slice(0, 120) ?? "";
}

function extractCoverImage(markdown: string): string | null {
  const match = markdown?.match(/!\[.*?\]\((.*?)\)/);
  return match?.[1] ?? null;
}

function PostCard({ post, activeTopic }: { post: Post; activeTopic?: string }) {
  const plain = extractPlainText(post.content ?? "");
  const coverImg = extractCoverImage(post.content ?? "");
  const slugPath = post.slug ?? "";
  const firstTag = Array.isArray(post.tags) && post.tags.length > 0 ? post.tags[0] : "식재료 백과";

  return (
    <Link
      href={`/post/${slugPath}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      {coverImg ? (
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImg}
            alt={post.title ?? "포스트 이미지"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full aspect-[16/9] bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center text-xs text-emerald-700 font-bold">
          #{firstTag}
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {Array.isArray(post.tags) && post.tags.length > 0 ? (
            post.tags.slice(0, 3).map((t) => (
              <Badge key={t} variant={t === activeTopic ? "emerald" : "gray"} size="sm">
                #{t}
              </Badge>
            ))
          ) : (
            <Badge variant="emerald" size="sm">
              식재료 백과
            </Badge>
          )}
        </div>
        <h2 className="text-base font-black text-gray-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {post.title}
        </h2>
        {plain && (
          <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-3">
            {plain}
          </p>
        )}
        {post.publishedAt && (
          <p className="text-[10px] text-gray-400 font-medium mt-auto pt-2">
            {new Date(post.publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}
      </div>
    </Link>
  );
}

export default async function PostFeedPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; topic?: string }> | { page?: string; topic?: string };
}) {
  const resolvedParams = await Promise.resolve(searchParams);
  const currentPage = Math.max(1, Number(resolvedParams?.page ?? 1));
  const activeTopic = resolvedParams?.topic ? decodeURIComponent(resolvedParams.topic).trim() : "";

  // 태그 검색(topic) 모드와 전체 목록 모드 분기 처리
  let posts: Post[] = [];
  let totalPages = 1;
  let popularTags: string[] = [];

  if (activeTopic) {
    // topic 쿼리스트링이 있을 때
    const [topicPosts, tags] = await Promise.all([
      getPublishedPostsByTopic(activeTopic),
      getPopularTags(),
    ]);
    posts = topicPosts;
    totalPages = 1;
    popularTags = tags;
  } else {
    // 전체 목록 모드
    const [pageData, tags] = await Promise.all([
      getPublishedPostPage(currentPage, 9),
      getPopularTags(),
    ]);
    posts = pageData?.content ?? [];
    totalPages = pageData?.totalPages ?? 1;
    popularTags = tags;
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* 히어로 헤더 */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 w-fit">
              식재료 백과
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              재료를 알면<br className="sm:hidden" /> 요리가 달라집니다
            </h1>
            <p className="text-sm sm:text-base text-gray-500 font-medium max-w-md leading-relaxed">
              신선한 식재료 선택부터 보관, 영양까지. 머그인이 엄선한 식재료 이야기를 만나보세요.
            </p>

            {/* 현재 선택된 태그 필터 뱃지 (✕ 해제 버튼 100% 동작) */}
            {activeTopic && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs font-black text-gray-400">선택된 태그:</span>
                <Badge variant="emerald" size="md" className="inline-flex items-center gap-1">
                  <span>#{activeTopic}</span>
                  <Link href="/post" className="hover:text-emerald-900 transition-colors ml-1 font-bold cursor-pointer" title="태그 필터 해제">
                    ✕
                  </Link>
                </Badge>
              </div>
            )}

            {/* 인기 태그 칩 바 */}
            {popularTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-2 mt-1">
                <span className="text-xs font-black text-gray-400">인기 태그:</span>
                {popularTags.map((tag) => (
                  <Link key={tag} href={`/post?topic=${encodeURIComponent(tag)}`}>
                    <Badge
                      variant={tag === activeTopic ? "emerald" : "gray"}
                      size="sm"
                      className="hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 포스트 그리드 & 페이지네이션 */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        {posts.length === 0 ? (
          <FallbackPage
            icon="🌱"
            title={activeTopic ? `'#${activeTopic}' 관련 글을 찾을 수 없습니다.` : "아직 게시된 아티클이 없습니다."}
            description={activeTopic ? "다른 태그를 선택해보시거나 전체 식재료 백과를 둘러보세요." : "관리자가 머그인의 첫 식재료 이야기와 보관 노하우를 준비 중입니다."}
            primaryAction={activeTopic ? { label: "식재료 백과 전체보기", href: "/post" } : undefined}
          />
        ) : (
          <>
            {activeTopic && (
              <p className="text-xs font-bold text-gray-500 mb-4">
                &apos;#{activeTopic}&apos; 태그 관련 <span className="text-emerald-600 font-black">{posts.length}</span>개의 식재료 글
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post, idx) => (
                <PostCard key={post.postId ?? idx} post={post} activeTopic={activeTopic} />
              ))}
            </div>

            <PostPagination pageNow={currentPage} pageMax={totalPages} topic={activeTopic} />
          </>
        )}
      </section>
    </main>
  );
}
