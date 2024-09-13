import React, { useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import Image from "next/image";
import { resizeFile } from "@/app/(commom)/ImgResizer";

function PhotoHolder({photos, setPhotos}:{photos:File[], setPhotos:(files:File[])=>void}){

    /**사진 업로드 */
    const handlePhotoUpload = async(evt:React.ChangeEvent<HTMLInputElement>)=>{
        const file: File | null | undefined = evt.target.files?.[0];
        
        if(file){
            const resizedFile = await resizeFile(file) as File;

            setPhotos([...photos, resizedFile]);
        } 
    };

    /**현재 useState 배열에서 인덱스에 해당하는 사진 제거 */
    const deletePhoto = (inx:number)=>{
        const deletedPhoto = photos.filter((_, index) => index !== inx);
        setPhotos(deletedPhoto);
    };

    const photoPreviewComps = photos.map((ele, inx)=>{
        const fileUrl = URL.createObjectURL(ele);

        return (
            //보더 등 설정, x하면 삭제되게 설정
            <div key={inx} className="m-1 relative border rounded-xl min-w-[150px] min-h-[150px] w-[150px] h-[150px]">
                <div className="w-full text-right">
                    <button onClick={()=>deletePhoto(inx)} className="right-top-xboxBtn">
                        <ClearIcon className="bg-white"/>
                    </button>
                </div> 
                <Image className="inner-img" width={150} height={150} src={fileUrl} alt="no imgage"/>
            </div>
            )
    })

    return (
        <div className="flex justify-start items-center w-full overflow-x-scroll">
            <input onChange={(evt)=>{
                handlePhotoUpload(evt);
            }} id="board-file-input" type="file" accept=".jpg, .jpeg, .png, .gif, .webp" hidden={true}/>
            {photoPreviewComps}
            {
            photos.length < 3 &&
            <label className="flex justify-center items-center border border-[#d1d1d1] w-20 h-20 m-3 cursor-pointer" htmlFor="board-file-input">
                <AddIcon sx={{fill:'black', width:'2.5rem', height:'2.5rem'}}/> 
            </label>
            }
        </div>
    )
}

export default React.memo(PhotoHolder);