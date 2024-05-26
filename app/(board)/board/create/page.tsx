"use client"

import { axiosAuthInstacne } from '@/app/(customAxios)/authAxios';
import dynamic from 'next/dynamic'
import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import SetDiet from './(Diet)/SetDiet';
import SetRecipe from './(Recipe)/SetRecipe';
import SetPhoto from './(Photo)/SetPhoto';
import { Recipe } from '@/app/(recipe)/types/recipeType';
import { DietDay } from '@/app/(type)/diet';
import axios from 'axios';

// const QuillNoSSRWrapper = dynamic(import('react-quill'), {
//   ssr: false,
//   loading: () => <p>Loading ...</p>,
// });
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading:()=><p>Loading ...</p> });

export default function CreateNewBoardPost(){
    const [boardMstUUID, setBoardMstUUID] = useState<string>("");
    const [title, setTitle]         = useState<string>("");
    const [content, setContent]     = useState<string>("");
    const [recipes, setRecipes]     = useState<Recipe[]>([]);
    const [photos, setPhotos]       = useState<File[]>([]);
    const [dietDay, setDietDay]     = useState<DietDay[]>([]);


    console.log("포토", photos);
    console.log("레시피 ", recipes);

    const quill_module = {
        toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean'],
    ],
    }

    /**게시물 post 제출 */
    const postbtn = ()=>{
        const boardContent = {
            title:title,
            content:content,
            recipes:recipes,
            dietDays:dietDay
        }

        const formData = new FormData();
        photos.forEach((photo)=>{
            formData.append('files', photo);
        })

        formData.append('boardContent', JSON.stringify(boardContent));
        formData.append('boardMstUUID', boardMstUUID);

        console.log(formData);

        axiosAuthInstacne
        .post(`${process.env.NEXT_PUBLIC_API_URL}board/create`, formData, {
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
        .then((res) => {
            console.log(res);
        })
    }

    return (
        <>
            <div>
                {/* have to :: del ... 사용자가 픽하는 게시판을 목록으로 보여주도록 변경 */}
                <input type="text" value={boardMstUUID} onChange={(evt)=>setBoardMstUUID(evt.target.value)} /> 
                <input className='border-none outline-none p-2 text-xl font-bold' type="text" 
                placeholder='제목을 입력해주세요.' value={title} onChange={(evt)=>setTitle(evt.target.value)} />
            </div>
            <div className='h-[668px]'>
                <div className='h-[620px] bg-white'>
                    <ReactQuill className='h-full' onChange={setContent} modules={quill_module}/>
                </div>
            </div>
            <SetRecipe recipes={recipes} setRecipes={setRecipes}/>
            <SetDiet dietDay={dietDay} setDietDay={setDietDay}/>
            <SetPhoto photos={photos} setPhotos={setPhotos}/>
            <div className='bottom-3 w-full flex justify-center'>
                <button className='saveBtn' onClick={postbtn}>버튼 누름</button>
            </div>
        </>
    )
}