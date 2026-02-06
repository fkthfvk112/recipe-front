"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import { fetchAnyPostDetail, fetchPostDetailById, updatePost } from "@/app/(api)/post";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Checkbox } from "@mui/material";
import ReactMarkdown from "react-markdown";

type Props = {
  params: {
    postId: string;
  };
};

export default function EditPostPage({ params }: Props) {
  const router = useRouter();

  const [postId, setPostId] = useState<number>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [isDraft, setIsDraft] = useState(true);

  const [loading, setLoading] = useState(true);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
      } catch {
        Swal.fire("게시글을 불러올 수 없습니다.", "", "error");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [params.postId]);

  /** 저장 */
  const onSave = async () => {
    if (!postId) return;

    const swalTitle = isDraft ? "게시글을 임시 저장으로 저장할까요?" : "게시글을 실제로 발행할까요?"
    Swal.fire({
      title:swalTitle,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "저장",
      cancelButtonText: "취소",
      confirmButtonColor: "#38c54b",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      await updatePost(postId, {
        title,
        content,
        slug,
        isDraft,
      });

      Swal.fire("저장 완료", "", "success").then(() => {
        if(!isDraft){
          router.push(`/post/${slug}`);
        }else{
          router.push(`/admin/post/${params.postId}`);
        }
      });
    });
  };

  /** 취소 */
  const onCancel = () => {
    router.back();
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (textAreaRef.current) {
      const height = textAreaRef.current.scrollHeight;
      if (height <= 8000) {
        setContent(e.target.value);
      }
    }
  };

  if (loading) return <div className="defaultInnerContainer">로딩 중...</div>;

  return (
    <div className="defaultOuterContainer pt-10 pb-[100px]">
      <section className="defaultInnerContainer">

        {/* 제목 */}
        <input
          className="border-none outline-none p-3 text-2xl font-bold w-full"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={60}
        />
        <div className="bottom-line" />

        {/* 슬러그 */}
        <input
          className="border border-gray-200 rounded p-2 mt-4 w-full"
          placeholder="slug (ex: onion/storage)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        {/* 본문 */}
        <div className="mt-6 bg-white">
          <textarea
            ref={textAreaRef}
            className="border-none outline-none w-full h-[600px] p-3"
            placeholder="마크다운으로 내용을 작성하세요"
            value={content}
            onChange={handleContentChange}
          />
        </div>

        {/* 게시 여부 */}
        <div className="flex items-center mt-4">
          <Checkbox
            checked={isDraft}
            onChange={() => setIsDraft(prev => !prev)}
            color="success"
          />
          <span>임시 저장 여부(체크 해제 시 게시/공개)</span>
        </div>
      </section>
      <div className="w-full bg-[#e1e1e1] text-center">
        <h1 className="mt-16 mb-3">미리보기</h1>
      </div>
      <section className="defaultInnerContainer" style={{paddingLeft:'1rem', marginTop:'2.5rem', paddingRight:'1rem'}}>
        <article className="prose 
          prose-headings:mb-2
          prose-p:mt-0
          prose-p:mb-4
          max-w-none
          w-full">
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        </article>
      </section>
      {/* 하단 버튼 */}
      <div className="z-[10] flex justify-end fixed bottom-0 bg-white w-full p-3 pr-8 top-line-noM">
        <div className="w-full flex justify-between max-w-[260px]">
          <button className="grayBtn" onClick={onCancel}>
            취소
          </button>
          <button className="greenBtn" onClick={onSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
