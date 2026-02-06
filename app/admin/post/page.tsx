"use client";

import { useEffect, useState, useRef } from "react";
import { fetchPostList, generatePostByAI } from "@/app/(api)/post";
import CircularProgress from "@mui/material/CircularProgress";
import PostPreviewAdminHoriItem from "./PostPreviewAdminHoriItem";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function DraftPost() {
  const [postList, setPostList] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ingredient, setIngredient] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [refetch, setRefetch] = useState<number>(0);

  const viewRef = useRef<HTMLDivElement | null>(null);

  const fetchDraftPosts = async () => {
    try {
      setIsLoading(true);

      const data = await fetchPostList(); // Post[]

      if (Array.isArray(data)) {
        setPostList(data);
      }
    } catch (e) {
      console.error("draft post fetch error", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDraftPosts();
  }, [refetch]);

  const postPreviews = postList.flatMap((post, idx) =>
        <PostPreviewAdminHoriItem
            key={`post-${post.postId ?? idx}`}
            postPreview={post}
      />);

  const noContent = (
    <li className="text-center text-gray-400 py-20">
      작성된 임시 글이 없습니다.
    </li>
  );


  const generatePost = async () => {
    if (!ingredient.trim()) {
      Swal.fire({
        title: "식재료명을 입력해주세요.",
        icon: "warning",
      });
      return;
    }

    setIsGenerating(true);

    // 로딩 모달
    withReactContent(Swal).fire({
      title: "게시글을 생성하는 중...",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      html: (
        <div className="overflow-y-hidden flex justify-center">
          <CircularProgress />
        </div>
      ),
    });

    try {
      // AI 게시글 생성
      await generatePostByAI(ingredient);

      // Draft 리스트 다시 조회
      setRefetch(prev=>prev+1);
      setIngredient("");

      Swal.fire({
        title: "게시글 생성 완료!",
        icon: "success",
      });
    } catch (e) {
      console.error("AI post generate error", e);

      Swal.fire({
        title: "게시글 생성에 실패했습니다.",
        text: "잠시 후 다시 시도해주세요.",
        icon: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <section className="border m-3 rounded-xl flex flex-col p-3">
        <h1>게시글 자동 생성</h1>
        <input onChange={(evt)=>{setIngredient(evt.target.value)}} value={ingredient} type="text" placeholder="생성할 게시글의 식재료명 입력"/>
        <button onClick={()=>{generatePost()}} className="greenBtn w-[200px] mt-3">게시글 자동 생성하기</button>
      </section>
      <ul className="w-full h-full min-h-[300px] p-2">
        {!isLoading && postList.length === 0
          ? noContent
          : postPreviews}
      </ul>

      <div className="h-10 flex justify-center items-center" ref={viewRef}>
        {isLoading && <CircularProgress />}
      </div>
    </>
  );
}
