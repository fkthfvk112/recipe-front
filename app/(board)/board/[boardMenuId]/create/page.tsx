"use client";

import { axiosAuthInstacne } from '@/app/(customAxios)/authAxios';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Recipe } from '@/app/(recipe)/types/recipeType';
import { DietDay } from '@/app/(type)/diet';
import { Checkbox, CircularProgress } from '@mui/material';
import SetRecipe from './(Recipe)/SetRecipe';
import SetDiet from './(Diet)/SetDiet';
import SetPhoto from './(Photo)/SetPhoto';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { Validation } from '@/app/(user)/check';
import { revalidateByTagName } from '@/app/(utils)/revalidateServerTag';
import useResponsiveDesignCss from '@/app/(commom)/Hook/useResponsiveDesignCss';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { scrollYCacheAtom } from '@/app/(recoil)/scrollYCacheSelector';
import { boardCacheSelectorAtom } from '@/app/(recoil)/boardCacheSelector';
import { cacheKey } from '@/app/(recoil)/cacheKey';
import useChkLoginToken from '@/app/(commom)/Hook/useChkLoginToken';
import { checkAnonymousAtom } from '@/app/(recoil)/userFeedAtom';

function CreateNewBoardPost({
  params
}: {
  params: { boardMenuId: number };
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkAnonymous, setCheckAnonymous] = useRecoilState<boolean>(checkAnonymousAtom);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [dietDay, setDietDay] = useState<DietDay[]>([]);
  const { layoutBottomMargin } = useResponsiveDesignCss();

  const boardCacheReset = useResetRecoilState(scrollYCacheAtom(cacheKey.board_key + params.boardMenuId));
  const boardScrollYReset = useResetRecoilState(boardCacheSelectorAtom(cacheKey.board_key + params.boardMenuId));

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const isTokenValid = useChkLoginToken("refreshNeed");

  /** 게시물 post 제출 */
  const postbtn = () => {
    if (!chkBoardValid().isValid) {
      Swal.fire({
        title: "입력 내용을 확인해주세요.",
        icon: "error",
        text: chkBoardValid().message,
        confirmButtonColor: "#10b981",
      });
      return;
    }

    withReactContent(Swal).fire({
      title: "게시글 작성 중...",
      showConfirmButton: false,
      allowOutsideClick: false,
      html: <div className="overflow-y-hidden"><CircularProgress sx={{ color: "#10b981" }} /></div>
    });

    const boardContent = {
      title: title,
      content: content,
      recipes: recipes,
      dietDays: dietDay,
      checkAnonymous: checkAnonymous
    };

    const formData = new FormData();
    photos.forEach((photo) => {
      formData.append('files', photo);
    });

    formData.append('boardContent', JSON.stringify(boardContent));
    formData.append('boardMenuId', `${params.boardMenuId}`);

    setIsLoading(true);

    axiosAuthInstacne
      .post(`${process.env.NEXT_PUBLIC_API_URL}board/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        revalidateByTagName(`boardMenu-${params.boardMenuId}`);
        boardCacheReset();
        boardScrollYReset();
        Swal.fire({
          title: "게시가 완료되었습니다!",
          icon: "success",
          confirmButtonColor: "#10b981",
        }).then(() => {
          router.replace(`/board/${params.boardMenuId}`);
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const chkBoardValid = (): Validation => {
    if (title.length < 1 || title.length > 30) {
      return {
        isValid: false,
        message: "제목의 길이는 1자 이상 30자 이하여야 해요."
      };
    }
    if (content.length < 3 || content.length > 1024) {
      return {
        isValid: false,
        message: "내용의 길이는 3자 이상 1024자 이하여야 해요."
      };
    }
    if (recipes.length > 3) {
      return {
        isValid: false,
        message: "레시피는 3개까지 첨부할 수 있어요."
      };
    }
    if (photos.length > 3) {
      return {
        isValid: false,
        message: "사진은 3장까지 올릴 수 있어요."
      };
    }
    if (dietDay.length > 3) {
      return {
        isValid: false,
        message: "식단은 3개까지 올릴 수 있어요."
      };
    }
    return {
      isValid: true,
      message: "valid"
    };
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
      {/* Title Input Section - font-medium rule applied */}
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

      {/* Content TextArea Section - font-medium rule applied */}
      <div className="mb-6">
        <textarea
          ref={textAreaRef}
          className="w-full h-80 p-3 text-sm font-medium text-gray-800 border border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all resize-none placeholder-gray-400"
          value={content}
          onChange={(e) => handleChangeContent(e)}
          placeholder="내용을 자유롭게 입력해주세요."
          maxLength={1024}
        />
      </div>

      {/* Attached Media Selectors */}
      <div className="space-y-4 mb-6">
        <SetRecipe recipes={recipes} setRecipes={setRecipes} />
        <SetDiet dietDay={dietDay} setDietDay={setDietDay} />
        <SetPhoto photos={photos} setPhotos={setPhotos} />
      </div>

      {/* Sticky Action Footer */}
      <section className={`fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-200/60 p-3.5 shadow-lg ${layoutBottomMargin}`}>
        <div className="max-w-2xl mx-auto flex justify-between items-center px-4">
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer">
            <Checkbox
              onChange={() => setCheckAnonymous(!checkAnonymous)}
              checked={checkAnonymous}
              sx={{ color: "#10b981", '&.Mui-checked': { color: '#10b981' } }}
              size="small"
            />
            <span>익명으로 게시</span>
          </label>

          <button
            className="px-6 py-2.5 text-xs font-extrabold text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl cursor-pointer transition-all shadow-md border-none disabled:opacity-50"
            onClick={postbtn}
            disabled={isLoading}
          >
            게시글 작성
          </button>
        </div>
      </section>
    </div>
  );
}

export default React.memo(CreateNewBoardPost);