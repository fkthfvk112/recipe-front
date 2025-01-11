import { resizeFileToBase64 } from "@/app/(commom)/ImgResizer";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Image from "next/image";
import { useState } from "react";
import Swal from "sweetalert2";

export default function ImgUpload(){
    const [imgName, setImgName] = useState<string>("");
    const [imgFile, setImgFile] = useState<File|undefined>();
    const [imgString, setImgString] = useState<string>("");

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
        event
      ) => {
        if (event.target.files) {
          const file = event.target.files[0];
          setImgFile(file);
          if (file) {
            try {
              const base64String = await resizeFileToBase64(file) as string;
              setImgString(base64String);
                } catch (error) {
              console.error("파일 변환 오류:", error);
            }
          }
        }
      };

    const saveFridgeImg = ()=>{
        if(imgName.length < 1) {
            alert("이미지명을 입력해주세요.");
            return;
        }
        if(imgFile === undefined || imgFile === null){
            alert("파일을 업로드해주세요.");
            return;
        }
        const formData = new FormData();
        formData.append('file', imgFile);
        formData.append('imgName', imgName);

        axiosAuthInstacne
            .post(`${process.env.NEXT_PUBLIC_API_URL}admin/fridge/item/image`, formData, {
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            .then((res)=>{
                Swal.fire({
                    title: "업로드가 완료되었습니다!",
                    icon: "success",
                  });
                setImgName("");
                setImgFile(undefined);
                setImgString("");
            })
    }  

    return(
        <section className="w-full mb-20">
            <h2 className="text-xl">
                식재료 이미지 등록
            </h2>
            <p>식재료 이미지를 등록해요.</p>
            <div className="mt-10">
                <h3>이미지 이름</h3>
                <input type="text" value={imgName} onChange={(evt)=>{
                    setImgName(evt.target.value);
                }} />
            </div>
            <input
                className="border border-slate-500  mt-5"
                onChange={handleFileChange}
                type="file"
                accept=".jpg, .jpeg, .png, .gif, .webp"
            /> 
            <div className="m-1 relative border rounded-xl min-w-[150px] min-h-[150px] w-[150px] h-[150px] mt-5">
                <Image className="inner-img" width={150} height={150} src={imgString} alt="no imgage"/>
            </div>
            <button onClick={saveFridgeImg} className="greenBtn mt-10">업로드</button>
        </section>
    )

}