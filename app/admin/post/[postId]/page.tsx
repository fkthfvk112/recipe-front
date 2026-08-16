"use client";

import { useEffect, useRef, useState, ChangeEvent, useCallback } from "react";
import { fetchPostDetailById, updatePost, uploadPostImage } from "@/app/(api)/post";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Checkbox } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import useResponsiveDesignCss from "@/app/(commom)/Hook/useResponsiveDesignCss";
import { PrimaryButton, CancelButton } from "@/app/(commom)/Component/Buttons";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

type Props = {
  params: {
    postId: string;
  };
};

const TOOLBAR_ITEMS = [
  { label: "H1", action: "h1", title: "제목 1" },
  { label: "H2", action: "h2", title: "제목 2" },
  { label: "H3", action: "h3", title: "제목 3" },
  { label: "B", action: "bold", title: "굵게" },
  { label: "I", action: "italic", title: "기울임" },
  { label: "링크", action: "link", title: "링크 삽입" },
  { label: "인용", action: "quote", title: "인용문" },
  { label: "코드", action: "code", title: "인라인 코드" },
  { label: "구분선", action: "hr", title: "수평선" },
  { label: "회색 박스", action: "callout", title: "회색 배경 강조 상자" },
];

export default function EditPostPage({ params }: Props) {
  const router = useRouter();

  const [postId, setPostId] = useState<number>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [tags, setTags] = useState<string[]>(["양파", "보관법"]);
  const [tagInput, setTagInput] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { layoutBottomMargin } = useResponsiveDesignCss();

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, "");
      if (val && !tags.includes(val)) {
        setTags((prev) => [...prev, val]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  /** 초기 데이터 세팅 */
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const data = await fetchPostDetailById(params.postId);
        if (!mounted) return;
        setPostId(data.postId);
        setTitle(data.title);
        setContent(data.content);
        setSlug(data.slug);
        setIsDraft(data.draft);
        if (Array.isArray(data.tags)) {
          setTags(data.tags);
        }
      } catch {
        Swal.fire("게시글을 불러올 수 없습니다.", "", "error");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, [params.postId]);

  /** 커서 위치에 텍스트 삽입 */
  const insertAtCursor = useCallback((before: string, after: string = "", placeholder: string = "") => {
    const ta = textAreaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const newContent =
      content.slice(0, start) +
      before + selected + after +
      content.slice(end);
    setContent(newContent);
    requestAnimationFrame(() => {
      ta.focus();
      const newCursor = start + before.length + selected.length + after.length;
      ta.setSelectionRange(newCursor, newCursor);
    });
  }, [content]);

  /** 툴바 액션 처리 */
  const handleToolbarAction = useCallback((action: string) => {
    switch (action) {
      case "h1": insertAtCursor("# ", "", "제목"); break;
      case "h2": insertAtCursor("## ", "", "제목"); break;
      case "h3": insertAtCursor("### ", "", "제목"); break;
      case "bold": insertAtCursor("**", "**", "굵은 텍스트"); break;
      case "italic": insertAtCursor("*", "*", "기울임 텍스트"); break;
      case "link": insertAtCursor("[", "](https://)", "링크 텍스트"); break;
      case "quote": insertAtCursor("> ", "", "인용 내용"); break;
      case "code": insertAtCursor("`", "`", "코드"); break;
      case "hr": insertAtCursor("\n---\n", "", ""); break;
      case "callout":
        insertAtCursor(
          ">"
        );
        break;
      default: break;
    }
  }, [insertAtCursor]);

  /** 파일 업로드 */
  const handleImageUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire("이미지 파일만 업로드 가능합니다.", "", "warning");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire("10MB 이하의 이미지만 업로드 가능합니다.", "", "warning");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadPostImage(file);
      const alt = file.name.replace(/\.[^.]+$/, "");
      insertAtCursor(`\n![${alt}](${url}#w=100%)\n`, "", "");
      Swal.fire({
        title: "이미지 업로드 완료!",
        text: "Tip: URL 뒤의 #w=100%를 #w=300px 또는 #w=50%로 변경하여 크기를 조절할 수 있습니다.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("이미지 업로드에 실패했습니다.", "잠시 후 다시 시도해주세요.", "error");
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  }, [insertAtCursor]);

  /** AI 이미지 원클릭 생성 & 커서 자동 주입 */
  const handleGenerateAiImage = useCallback(async () => {
    const { value: prompt } = await Swal.fire({
      title: "🪄 AI 3D 일러스트 자동 생성",
      input: "textarea",
      inputLabel: "생성하고 싶은 이미지 프롬프트(묘사)를 디테일하게 입력하세요",
      inputPlaceholder: "예: 투명한 유리 밀폐 용기 안에 깔끔하게 보관된 싱싱한 땅콩들, 서늘한 주방 배경",
      inputAttributes: {
        rows: "4",
        style: "font-size: 14px; line-height: 1.5; resize: vertical;",
      },
      showCancelButton: true,
      confirmButtonText: "🎨 생성하기",
      cancelButtonText: "취소",
      confirmButtonColor: "#10b981",
      inputValidator: (val) => {
        if (!val || !val.trim()) {
          return "프롬프트를 입력해 주세요!";
        }
      },
    });

    if (!prompt) return;

    Swal.fire({
      title: "AI 일러스트 생성 중...",
      html: "프리미엄 3D 일러스트 생성 후 Cloudinary에 업로드하고 있습니다.",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const { generateAiImage } = await import("@/app/(api)/post");
      const imageUrl = await generateAiImage(prompt.trim());

      if (imageUrl) {
        insertAtCursor(`\n![${prompt.trim()}](${imageUrl})\n`, "", "");
        Swal.fire({
          title: "AI 이미지 생성 완료!",
          text: "본문 커서 위치에 이미지 마크다운이 자동으로 주입되었습니다.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Empty image URL");
      }
    } catch {
      Swal.fire("이미지 생성 실패", "잠시 후 다시 시도해 주세요.", "error");
    }
  }, [insertAtCursor]);

  /** AI 프롬프트 안내 창 */
  const handleAiPromptHelp = useCallback(() => {
    Swal.fire({
      title: "🪄 AI 게시글 삽화 팁",
      html: `
        <div class="text-left text-xs space-y-2 text-gray-600">
          <p>• <b>마크다운 이미지 규격:</b> <code>![이미지 설명/프롬프트](Cloudinary URL)</code></p>
          <p>• <b>원클릭 자동 생성:</b> 상단의 <b>[🪄 AI 3D 이미지 생성]</b> 버튼을 누르고 원하는 그림을 적으면 Cloudinary 업로드 후 본문 커서 위치에 바로 주입됩니다!</p>
        </div>
      `,
      confirmButtonText: "확인",
      confirmButtonColor: "#10b981",
    });
  }, []);

  /** 저장 */
  const onSave = async () => {
    if (!postId) return;
    const swalTitle = isDraft ? "임시 저장하시겠습니까?" : "게시글을 공개 발행하시겠습니까?";
    const result = await Swal.fire({
      title: swalTitle,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: isDraft ? "임시 저장" : "발행",
      cancelButtonText: "취소",
      confirmButtonColor: "#10b981",
    });
    if (!result.isConfirmed) return;

    setSaving(true);
    Swal.fire({
      title: isDraft ? "저장 중..." : "발행 중...",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    try {
      await updatePost(postId, { title, content, slug, isDraft, tags });
      Swal.fire({ title: isDraft ? "임시 저장 완료!" : "발행 완료!", icon: "success", timer: 1200, showConfirmButton: false }).then(() => {
        router.refresh();
        if (!isDraft) {
          router.replace(`/post/${slug}`);
        } else {
          router.replace(`/admin/post`);
        }
      });
    } catch {
      Swal.fire("저장에 실패했습니다.", "잠시 후 다시 시도해주세요.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">게시글 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ─── 상단 메타 설정 패널 ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
          {/* 제목 */}
          <input
            className="border-none outline-none text-2xl font-black text-gray-900 w-full bg-transparent placeholder:text-gray-300 focus:ring-0"
            placeholder="게시글 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
          />
          {/* 슬러그 + 게시 여부 */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
              <span className="text-xs font-bold text-gray-400 whitespace-nowrap">URL slug</span>
              <input
                className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 flex-1 bg-gray-50 focus:bg-white focus:border-emerald-400 outline-none transition-colors"
                placeholder="onion/storage"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            {/* 태그 리스트 관리 칩 입력 UI */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100 w-full">
              <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                ⚠️ slug는 /로 나뉘어진 영문이어야합니다. (예: banana/storage)
              </p>
              <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                ⚠️ [운영 규약] 첫 번째 태그(Index 0)는 해당 포스팅의 대표 식재료명이어야 합니다. (예: 양파)
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-gray-500 shrink-0">🏷️ 태그:</span>
              {tags.map((t) => (
                <span
                  key={t}
                  style={{ width: "fit-content", display: "inline-flex", minWidth: 0 }}
                  className="items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs whitespace-nowrap shrink-0"
                >
                  <span>#{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    style={{ width: "auto", minWidth: 0, padding: 0, margin: 0, lineHeight: 1 }}
                    className="text-emerald-500 hover:text-rose-600 font-bold border-none bg-transparent cursor-pointer ml-1 text-[10px] shrink-0"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="태그 입력 후 Enter (예: 양파)..."
                className="border border-gray-200 rounded-lg px-2 py-0.5 text-xs text-gray-700 bg-gray-50 focus:bg-white focus:border-emerald-400 outline-none transition-colors w-40"
              />
              </div>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <Checkbox
                checked={isDraft}
                onChange={() => setIsDraft(prev => !prev)}
                color="success"
                size="small"
              />
              <span className={`text-xs font-bold ${isDraft ? "text-amber-600" : "text-emerald-600"}`}>
                {isDraft ? "⏸ 임시저장" : "🌍 공개 발행"}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* ─── 모바일 탭 토글 ─────────────────────────────────────────────── */}
      <div className="md:hidden flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex-1 py-2.5 text-xs font-bold transition-colors border-none ${activeTab === "edit" ? "text-emerald-600 border-b-2 border-b-emerald-500 bg-emerald-50/50" : "text-gray-400"}`}
        >
          ✏️ 편집
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2.5 text-xs font-bold transition-colors border-none ${activeTab === "preview" ? "text-emerald-600 border-b-2 border-b-emerald-500 bg-emerald-50/50" : "text-gray-400"}`}
        >
          👁 미리보기
        </button>
      </div>

      {/* ─── 메인 에디터 영역 ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-2 py-4 flex gap-4">
        {/* 에디터 패널 */}
        <div className={`flex flex-col flex-1 min-w-0 ${activeTab === "preview" ? "hidden md:flex" : "flex"}`}>
          {/* 마크다운 툴바 */}
          <div className="bg-white rounded-t-2xl border border-b-0 border-gray-200 px-2 py-2 flex flex-wrap gap-1 items-center">
            {TOOLBAR_ITEMS.map((item) => (
              <button
                key={item.action}
                title={item.title}
                onClick={() => handleToolbarAction(item.action)}
                className="px-2.5 py-1 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg border border-gray-200 transition-all cursor-pointer outline-none"
                style={{ width: "auto", minWidth: 0, padding: "0.25rem 0.625rem" }}
              >
                {item.label}
              </button>
            ))}

            <div className="w-px h-5 bg-gray-200 mx-1" />

            {/* 이미지 업로드 버튼 */}
            <button
              title="파일 이미지 업로드"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-all cursor-pointer outline-none disabled:opacity-50"
              style={{ width: "auto", minWidth: 0, padding: "0.25rem 0.75rem" }}
            >
              {uploading ? (
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 border border-emerald-400 border-t-transparent rounded-full animate-spin inline-block" />
                  업로드 중...
                </span>
              ) : (
                <span>🖼 이미지</span>
              )}
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* AI 3D 이미지 생성 버튼 */}
            <button
              title="AI 3D 일러스트 자동 생성"
              onClick={handleGenerateAiImage}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-lg shadow-sm transition-all cursor-pointer outline-none border-none"
              style={{ width: "auto", minWidth: 0, padding: "0.25rem 0.75rem" }}
            >
              <span>🪄 AI 3D 이미지 생성</span>
            </button>

            {/* AI 삽화 팁 버튼 */}
            <button
              title="AI 삽화 작성 팁"
              onClick={handleAiPromptHelp}
              className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all cursor-pointer outline-none"
              style={{ width: "auto", minWidth: 0, padding: "0.25rem 0.5rem" }}
            >
              <AutoAwesomeIcon style={{ fontSize: "14px" }} />
              <span>팁</span>
            </button>

            {/* 글자 수 */}
            <span className="ml-auto text-[10px] text-gray-300 font-medium">
              {content.length.toLocaleString()} 자
            </span>
          </div>

          {/* 텍스트 에어리어 */}
          <textarea
            ref={textAreaRef}
            className="flex-1 border border-gray-200 rounded-b-2xl p-5 text-sm font-mono leading-relaxed text-gray-800 bg-white resize-none outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all min-h-[600px]"
            placeholder="마크다운으로 내용을 작성하세요&#10;&#10;## 소제목&#10;내용...&#10;&#10;![이미지 설명](이미지 URL)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 미리보기 패널 */}
        <div className={`flex-1 min-w-0 ${activeTab === "edit" ? "hidden md:block" : "block"}`}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 min-h-[660px]">
            <h2 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">📄 실시간 미리보기</h2>
            <article className="prose prose-emerald max-w-none prose-headings:font-black prose-p:text-gray-700 prose-img:rounded-2xl prose-img:shadow-md prose-a:text-emerald-600">
              {content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    img: ({ src, alt, width, style }) => {
                      let customWidth: string | undefined = typeof width === "string" || typeof width === "number" ? String(width) : undefined;
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
                        <span className="block my-6 flex flex-col items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={alt ?? ""}
                            style={imgStyle}
                            className="rounded-2xl shadow-xs object-cover border border-gray-100 block mx-auto transition-all"
                            loading="lazy"
                          />
                        </span>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="bg-[#f3f4f6] border border-gray-200/60 rounded-[22px] p-6 my-6 text-gray-800 leading-relaxed font-normal shadow-2xs not-italic">
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
                  }}
                >
                  {content}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-300 text-sm">내용을 입력하면 여기에 미리보기가 나타납니다.</p>
              )}
            </article>
          </div>
        </div>
      </div>

      {/* ─── 하단 고정 액션 바 ─────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-6 py-3.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between">
        <div className="text-xs text-gray-500 font-medium hidden sm:block">
          {isDraft ? "⏸ 임시 저장 상태" : "🌍 공개 발행 상태"}
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <CancelButton size="md" onClick={() => router.back()}>
            취소
          </CancelButton>
          <PrimaryButton size="md" loading={saving} onClick={onSave}>
            {isDraft ? "임시 저장" : "발행하기"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
