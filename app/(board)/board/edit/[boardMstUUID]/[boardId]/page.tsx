"use client"

import { axiosAuthInstacne } from '@/app/(customAxios)/authAxios';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Recipe } from '@/app/(recipe)/types/recipeType';
import { DietDay } from '@/app/(type)/diet';
import { Checkbox } from '@mui/material';
import { Board } from '@/app/(type)/board';
import SetRecipe from '../../../create/[boardMstUUID]/(Recipe)/SetRecipe';
import SetDiet from '../../../create/[boardMstUUID]/(Diet)/SetDiet';
import SetPhoto from '../../../create/[boardMstUUID]/(Photo)/SetPhoto';
import { useSetRecoilState } from 'recoil';
import SetPhotoChk from './(Photo)/SetPhotoChk';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation'

interface BoardChangeChk{
    titleChk:    boolean,
    contentChk:  boolean,
    photosChk:      boolean,
    recipesChk:  boolean,
    dietDaysChk: boolean
}
export default function EditBoardPost({
    params
  }: {
    params:{boardMstUUID:string, boardId:string};
  }){
    const [checkAnonymous, setCheckAnonymous] = useState<boolean>(true);
    const [title, setTitle]                   = useState<string>("");
    const [content, setContent]               = useState<string>("");
    const [recipes, setRecipes]               = useState<Recipe[]>([]);
    const [photos, setPhotos]                 = useState<File[]>([]);
    const [dietDay, setDietDay]               = useState<DietDay[]>([]);

    const [initialData, setInitialData]       = useState<Board>();
    const [photoChangeChk, setPhotoChangeChk] = useState<boolean>();//사진 변화 상태 추적 

    const router = useRouter();
    
    const setInitialBoardData = (fetchData:Board)=>{
        setInitialData(fetchData);

        if(fetchData.title != undefined && fetchData.title.length > 0){
            setTitle(fetchData.title);
        }
        if(fetchData.content != undefined && fetchData.content.length > 0){
            setContent(fetchData.content);
        }
        if(fetchData?.recipes && fetchData?.recipes?.length > 0){
            setRecipes(fetchData.recipes);
        }
        if(fetchData?.photos && fetchData?.photos?.length > 0){
            const convertImgToFile = async(imgUrls:string[]):Promise<File[]>=>{
                const imgFileArr:File[] = await Promise.all(
                    imgUrls.map(async (url, inx)=>{
                        const res = await fetch(url);
                        const blob = await res.blob();
                        return new File([blob], `img${inx}`, {type:blob.type});
                    })
                );
                return imgFileArr;
            };

            convertImgToFile(fetchData.photos)
                .then((res)=>{
                    setPhotos(res);
                });
        }
        if(fetchData?.dietDays && fetchData?.dietDays?.length > 0){
            setDietDay(fetchData.dietDays);
        }
    }

    useEffect(()=>{
        axiosAuthInstacne.get(`board/detail?boardId=${params.boardId}`)
            .then((res)=>{
                setInitialBoardData(res.data);
            })
    }, [])

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const chkChange = ():BoardChangeChk=>{
        const boardChangeChk:BoardChangeChk = {
            titleChk:    false,
            contentChk:  false,
            photosChk:   false,
            recipesChk:  false,
            dietDaysChk: false
        }

        if(initialData?.title !== title){
            boardChangeChk.titleChk = true;
        }
        if(initialData?.content !== content){
            boardChangeChk.contentChk = true;
        }
        if(initialData?.recipes !== recipes){
            boardChangeChk.recipesChk = true;
        }
        if(initialData?.dietDays !== dietDay){
            boardChangeChk.dietDaysChk = true;
        }
        if(photoChangeChk){
            boardChangeChk.photosChk = true;
        }

        return boardChangeChk;
    }

    /**게시물 post 제출 */
    const postbtn = () => {
        const boardContent = {
            boardId: params.boardId,
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
        formData.append('boardMstUUID', params.boardMstUUID);
        formData.append('boardChangeChk', JSON.stringify(chkChange()));
    
        Swal.fire({
            title: "변경사항을 저장하시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "저장할래요.",
            cancelButtonText: "아니요!",
            confirmButtonColor: '#38c54b',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosAuthInstacne
                    .put(`${process.env.NEXT_PUBLIC_API_URL}board/update`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then((res) => {
                        Swal.fire({
                            title: "수정이 완료되었습니다!",
                            icon: "success",
                        }).then(() => {
                            //   if(revalidateTagName){
                            //     console.log("리발리!!")
                            //     revalidateByTagName(revalidateTagName);
                            //   }
                            router.push(`/board/detail/${params.boardId}`)
                        });
                    });
            }
        });          
    };
    

    const handleChangeContent = (e:ChangeEvent<HTMLTextAreaElement>)=>{
        if(textAreaRef.current){
            const height = textAreaRef.current.scrollHeight;

            const canWriteCon:boolean = height <= 620 && title.length <= 1024;
            canWriteCon&&setContent(e.target.value)            
        }
    }

    return (
        <div className="bg-[#FB8500] defaultOuterContainer pt-6 pb-[100px]">
            <section className="defaultInnerContainer">
            <div>
                {/* have to :: del ... 사용자가 픽하는 게시판을 목록으로 보여주도록 변경 */}
                <input className='border-none outline-none p-3 text-xl font-bold' type="text" 
                placeholder='제목을 입력해주세요.' maxLength={20} value={title} onChange={(evt)=>setTitle(evt.target.value)} />
                <div className='bottom-line'></div>
            </div>
            <div className='h-[668px]'>
                <div className='h-[620px] bg-white'>
                <textarea ref={textAreaRef} className='border-none outline-none h-[620px] overflow-hidden p-3' value={content} onChange={(e)=>handleChangeContent(e)}></textarea>
                </div>
            </div>
            <SetRecipe recipes={recipes} setRecipes={setRecipes}/>
            <SetDiet dietDay={dietDay} setDietDay={setDietDay}/>
            <SetPhotoChk photos={photos} setPhotos={setPhotos} setPhotoChangeChk={setPhotoChangeChk}/>
            </section>
            <div className='flex justify-end fixed bottom-0 bg-white w-full p-3 pr-12 top-line-noM'>
                <div className='flex justify-center items-center mr-10'>
                    <Checkbox onChange={()=>{setCheckAnonymous(!checkAnonymous)}} checked={checkAnonymous} className='mr-0' color="success" />익명
                </div>
                <button className='greenBtn' onClick={postbtn}>버튼 누름</button>
            </div>
         </div>
    )
}