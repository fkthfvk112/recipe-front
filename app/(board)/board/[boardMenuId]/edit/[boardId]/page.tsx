"use client";

import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import { DietDay } from "@/app/(type)/diet";
import { Checkbox } from "@mui/material";
import { Board } from "@/app/(type)/board";
import SetPhotoChk from "./(Photo)/SetPhotoChk";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import SetRecipe from "../../create/(Recipe)/SetRecipe";
import SetDiet from "../../create/(Diet)/SetDiet";
import useResponsiveDesignCss from "@/app/(commom)/Hook/useResponsiveDesignCss";
import { revalidateByTagName } from "@/app/(utils)/revalidateServerTag";
import useChkLoginToken from "@/app/(commom)/Hook/useChkLoginToken";
import { checkAnonymousAtom } from "@/app/(recoil)/userFeedAtom";
import { PrimaryButton } from "@/app/(commom)/Component/Buttons";

interface BoardChangeChk {
  titleChk: boolean;
  contentChk: boolean;
  photosChk: boolean;
  recipesChk: boolean;
  dietChk: boolean;
}

export default function BoardEdit({
  params,
}: {
  params: { boardMenuId: number; boardId: number };
}) {
  const [boardData, setBoardData] = useState<Board>();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [checkAnonymous, setCheckAnonymous] = useRecoilState<boolean>(checkAnonymousAtom);

  const [photos, setPhotos] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [dietDay, setDietDay] = useState<DietDay[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [photoChangeChk, setPhotoChangeChk] = useState<boolean>(false);
  const [recipeChangeChk, setRecipeChangeChk] = useState<boolean>(false);

  const isTokenValid = useChkLoginToken("refreshNeed");
  const [isSignIn] = useRecoilState(siginInState);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { layoutBottomMargin } = useResponsiveDesignCss();

  useEffect(() => {
    if (isTokenValid && !isSignIn) {
      router.push("/signin");
    }
  }, [isSignIn, router, isTokenValid]);

  useEffect(() => {
    axiosAuthInstacne
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}board/detail?boardId=${params.boardId}`
      )
      .then((res) => {
        const board: Board = res.data;
        setBoardData(board);
        setTitle(board.title);
        setContent(board.content);
        setPhotos(board.photos);
        setRecipes(board.recipes);
        setDietDay(board.dietDay ? [board.dietDay] : []);
        setCheckAnonymous(board.checkAnonymous ? board.checkAnonymous : false);
      });
  }, [params.boardId, setCheckAnonymous]);

  const validate = () => {
    if (!title || title.length < 2) {
      return { isValid: false, message: "제목은 2자 이상 입력해 주세요." };
    }
    if (!content || content.length < 2) {
      return { isValid: false, message: "내용은 2자 이상 입력해 주세요." };
    }
    return { isValid: true, message: "valid" };
  };

  const postbtn = () => {
    const { isValid, message } = validate();

    if (!isValid) {
      Swal.fire({
        title: message,
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    const boardChangeChk: BoardChangeChk = {
      titleChk: boardData?.title !== title,
      contentChk: boardData?.content !== content,
      photosChk: photoChangeChk,
      recipesChk: recipeChangeChk,
      dietChk: false,
    };

    setIsLoading(true);
    axiosAuthInstacne
      .put(`${process.env.NEXT_PUBLIC_API_URL}board/update`, {
        boardDTO: {
          boardId: params.boardId,
          boardMenuId: params.boardMenuId,
          title: title,
          content: content,
          recipes: recipes,
          photos: photos,
          dietDay: dietDay && dietDay.length > 0 ? dietDay[0] : null,
          checkAnonymous: checkAnonymous,
        },
        boardChangeChk: boardChangeChk,
      })
      .then(() => {
        Swal.fire({
          title: "수정 완료! 🎉",
          icon: "success",
          confirmButtonColor: "#10b981",
        }).then(() => {
          revalidateByTagName(`board-detail-${params.boardId}`);
          router.push(
            `/board/${params.boardMenuId}/detail/${params.boardId}`
          );
        });
      })
      .catch(() => {
        Swal.fire({
          title: "수정 실패",
          text: "게시글 수정 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (textAreaRef.current) {
      const height = textAreaRef.current.scrollHeight;
      const canWriteCon: boolean = height <= 620 && content.length <= 1024;
      canWriteCon && setContent(e.target.value);
    }
  };

  if (!isTokenValid) return <></>;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 bg-white min-h-screen text-left pb-28">
      {/* Title Input Section */}
      <div className="mb-4">
        <input
          className="w-full text-xl font-medium text-gray-900 border-b border-gray-200 pb-3 focus:border-emerald-500 focus:outline-none transition-all placeholder-gray-400"
          type="text"
          placeholder="제목을 입력해주세요."
          maxLength={60}
          value={title}
          onChange={(evt) => setTitle(evt.target.value)}
        />
      </div>

      {/* Content TextArea Section */}
      <div className="mb-6">
        <textarea
          ref={textAreaRef}
          className="w-full h-80 p-3 text-sm font-medium text-gray-800 border border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all resize-none placeholder-gray-400"
          value={content}
          onChange={(e) => handleChangeContent(e)}
          placeholder="내용을 입력해주세요."
          maxLength={1024}
        />
      </div>

      {/* Media Pickers */}
      <section className="space-y-4 mb-6">
        <SetRecipe recipes={recipes} setRecipes={setRecipes} />
        <SetDiet dietDay={dietDay} setDietDay={setDietDay} />
        <SetPhotoChk
          photos={photos}
          setPhotos={setPhotos}
          setPhotoChangeChk={setPhotoChangeChk}
        />
      </section>

      {/* Bottom Sticky Action Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-200/60 p-3.5 shadow-lg ${layoutBottomMargin}`}
      >
        <div className="max-w-2xl mx-auto flex justify-between items-center px-4">
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer">
            <Checkbox
              onChange={() => setCheckAnonymous(!checkAnonymous)}
              checked={checkAnonymous}
              sx={{ color: "#10b981", "&.Mui-checked": { color: "#10b981" } }}
              size="small"
            />
            <span>익명 게시</span>
          </label>

          <PrimaryButton onClick={postbtn} loading={isLoading}>
            수정 완료
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}