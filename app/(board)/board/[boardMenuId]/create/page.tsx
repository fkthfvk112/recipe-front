"use client"

import { axiosAuthInstacne } from '@/app/(customAxios)/authAxios';
import { ChangeEvent, useRef, useState } from 'react';
import { Recipe } from '@/app/(recipe)/types/recipeType';
import { DietDay } from '@/app/(type)/diet';
import { Checkbox, CircularProgress } from '@mui/material';
import SetRecipe from './(Recipe)/SetRecipe';
import SetDiet from './(Diet)/SetDiet';
import SetPhoto from './(Photo)/SetPhoto';
import withReactContent from 'sweetalert2-react-content'
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

export default function CreateNewBoardPost({
    params
  }: {
    params:{boardMenuId:number};
  }){
    const [checkAnonymous, setCheckAnonymous] = useRecoilState<boolean>(checkAnonymousAtom);
    const [title, setTitle]                   = useState<string>("");
    const [content, setContent]               = useState<string>("");
    const [recipes, setRecipes]               = useState<Recipe[]>([]);
    const [photos, setPhotos]                 = useState<File[]>([]);
    const [dietDay, setDietDay]               = useState<DietDay[]>([]);
    const {layoutBottomMargin}                = useResponsiveDesignCss(); 

    
    const boardCacheReset = useResetRecoilState(scrollYCacheAtom(cacheKey.board_key + params.boardMenuId));
    const boardScrollYReset = useResetRecoilState(boardCacheSelectorAtom(cacheKey.board_key + params.boardMenuId));
    

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const router = useRouter();

    const isTokenValid = useChkLoginToken("refreshNeed");

    /**게시물 post 제출 */
    const postbtn = ()=>{
        if(!chkBoardValid().isValid){
            Swal.fire({
                title: "에러가 발생하였습니다.",
                icon: "error",
                text:chkBoardValid().message
              });
            return;
        }
        
        withReactContent(Swal).fire({
            title:"게시글 작성 중...",
            showConfirmButton:false,
            allowOutsideClick:false,
            html:<div className="overflow-y-hidden"><CircularProgress /></div>
        })

        const boardContent = {
            title:title,
            content:content,
            recipes:recipes,
            dietDays:dietDay,
            checkAnonymous:checkAnonymous
        }

        const formData = new FormData();
        photos.forEach((photo)=>{
            formData.append('files', photo);
        })

        formData.append('boardContent', JSON.stringify(boardContent));
        formData.append('boardMenuId', `${params.boardMenuId}`);

        axiosAuthInstacne
        .post(`${process.env.NEXT_PUBLIC_API_URL}board/create`, formData, {
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
        .then((res) => {
            revalidateByTagName(`boardMenu-${params.boardMenuId}`);
            boardCacheReset();
            boardScrollYReset();
            Swal.fire({
                title: "게시가 완료되었습니다!",
                icon: "success",
              }).then(() => {
                router.push(`/board/${params.boardMenuId}`);
              });
        })
    }

    const chkBoardValid = ():Validation=>{
        if(title.length < 1 || title.length > 30){
            return{
                isValid:false,
                message:"제목의 길이는 1자 이상 30자 이하여야해요."
            }
        }
        if(content.length < 3 || content.length > 1024){
            return{
                isValid:false,
                message:"내용의 길이는 3자 이상 1024자 이하여야해요."
            }
        }
        if(recipes.length > 3){
            return{
                isValid:false,
                message:"사진 개수는 3개까지 올릴 수 있어요."
            }
        }
        if(photos.length > 3){
            return{
                isValid:false,
                message:"식단은 3개까지 올릴 수 있어요."
            }
        }
        if(dietDay.length > 3){
            return{
                isValid:false,
                message:"레시피는 3개까지 올릴 수 있어요."
            }
        }
        return{
            isValid:true,
            message:"valid"
        };
    }

    const handleChangeContent = (e:ChangeEvent<HTMLTextAreaElement>)=>{
        if(textAreaRef.current){
            const height = textAreaRef.current.scrollHeight;

            const canWriteCon:boolean = height <= 620 && title.length <= 1024;
            canWriteCon&&setContent(e.target.value)            
        }
    }

    if(!isTokenValid) return <></>

    return (
        <div className="defaultOuterContainer pt-10 pb-[100px]">
            <section className="defaultInnerContainer">
            <div>
                {/* have to :: del ... 사용자가 픽하는 게시판을 목록으로 보여주도록 변경 */}
                <input className='border-none outline-none p-3 text-xl font-bold' type="text" 
                placeholder='제목을 입력해주세요.' maxLength={20} value={title} onChange={(evt)=>setTitle(evt.target.value)} />
                <div className='bottom-line'></div>
            </div>
            <div className='h-[668px]'>
                <div className='h-[620px] bg-white'>
                <textarea ref={textAreaRef} className='border-none outline-none h-[620px] overflow-hidden p-3' 
                          value={content} onChange={(e)=>handleChangeContent(e)} placeholder='내용을 입력해주세요.' maxLength={1024}></textarea>
                </div>
            </div>
            <SetRecipe recipes={recipes} setRecipes={setRecipes}/>
            <SetDiet dietDay={dietDay} setDietDay={setDietDay}/>
            <SetPhoto photos={photos} setPhotos={setPhotos}/>
            </section>
            <div className={`z-[60] flex justify-end fixed bottom-0 bg-white w-full p-3 pr-8 shadow-[0_-5px_15px_0px_rgba(0,0,0,0.3)] ${layoutBottomMargin}`}>
                <div className='w-full flex justify-between max-w-[300px]'>
                    <div className='flex justify-center items-center'>
                        <Checkbox onChange={()=>{setCheckAnonymous(!checkAnonymous)}} checked={checkAnonymous} className='mr-0' color="success" />익명
                    </div>
                    <button className='greenBtn' onClick={postbtn}>게시글 작성</button>
                </div>
            </div>
         </div>
    )
}