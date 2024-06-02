import React from "react";
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import Image from "next/image";
import { resizeFile } from "@/app/(commom)/ImgResizer";

function PhotoHolder({photos, setPhotos}:{photos:File[], setPhotos:(files:File[])=>void}){

    /**사진 업로드 */
    const handlePhotoUpload = async(evt:React.ChangeEvent<HTMLInputElement>)=>{
        const file: File | null | undefined = evt.target.files?.[0];
        
        if(file){
            console.log("전", file);
            const resizedFile = await resizeFile(file) as File;
            console.log("후", resizedFile);

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
            <div key={inx} className="m-1 relative rounded-xl overflow-hidden w-[160px] h-[120px]">
                <div className="w-full text-right">
                    <button onClick={()=>deletePhoto(inx)} className="border-none w-5 h-5 mr-2 absolute -top-3 right-1 z-50">
                        <ClearIcon/>
                    </button>
                </div> 
                <Image className="inner-img" width={170} height={170} src={fileUrl} alt="no img"/>
            </div>
            )
    })

    return (
        <div className="flex justify-start items-center w-full overflow-x-scroll">
            <input onChange={(evt)=>{
                handlePhotoUpload(evt);
            }} id="board-file-input" type="file" hidden={true}/>
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