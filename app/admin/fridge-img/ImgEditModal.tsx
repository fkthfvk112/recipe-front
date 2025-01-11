import { Box, Modal } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import React, { DispatchWithoutAction, useEffect, useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import styles from "./adminUser.module.css"
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { FridgeImg } from "@/app/(type)/fridge";
import { resizeFileToBase64 } from "@/app/(commom)/ImgResizer";


const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '95%',
    maxWidth:512,
    minWidth:280,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

function ImgEditModal({imgItem, open, setOpen, refetcher}:{imgItem:FridgeImg, open:boolean, setOpen:(data:any)=>void, refetcher:DispatchWithoutAction}){
    const [item, setImgItem] = useState<FridgeImg>(imgItem);

    useEffect(()=>{
        setImgItem(imgItem);
    }, [imgItem])

    const setItemChg = (evt:React.ChangeEvent<HTMLInputElement>)=>{
        if (item) {
            const target = evt.target as HTMLInputElement; 
            setImgItem({
              ...item,
              [target.name]: target.value,
            });
        }
    }

    console.log("이미지스", item);

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
        event
        ) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (file) {
            try {
                const base64String = await resizeFileToBase64(file) as string;
                setImgItem({
                    ...item,
                    imgUrl:base64String
                })
                } catch (error) {
                console.error("파일 변환 오류:", error);
            }
            }
        }
          };

    const saveImgItem = ()=>{
        Swal.fire({
            title: "변경사항을 저장하시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "저장하기",
            cancelButtonText: "취소",
            confirmButtonColor: '#38c54b',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosAuthInstacne
                    .put(`admin/fridge/item/image`, item)
                    .then((res) => {
                        Swal.fire({
                            title: "수정이 완료되었습니다!",
                            icon: "success",
                        }).then(() => {
                            setOpen(false);
                            refetcher();
                        });
                    });
            }
        });      
     }

    return (
        <Modal
        open={open}
        onClose={() => {
            setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <div className="absolute right-3 top-2 cursor-pointer" onClick={()=>setOpen(false)}>
                <ClearIcon/>
            </div>
            <section className="flex flex-col justify-center items-center">
                <div>
                    <input
                        className="border border-slate-500  mt-5"
                        onChange={handleFileChange}
                        type="file"
                        accept=".jpg, .jpeg, .png, .gif, .webp"
                    /> 
                    <div className="w-full flex-center">
                        <div className="m-1 relative border rounded-xl min-w-[150px] min-h-[150px] w-[150px] h-[150px] mt-5">
                            <Image className="inner-img" width={150} height={150} src={item.imgUrl} alt="no imgage"/>
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    <h1>이미지명</h1>
                    <input name="imgName" type="text" value={item?.imgName || ""}  onChange={setItemChg} />
                </div>
                <div className="mt-3">
                    {/* <h1>분류</h1> 구현하기 */}
                </div>
                <div></div>
                <div></div>

            </section>
            <div className="w-full text-center mt-6">
                <button onClick={saveImgItem} className="greenBtn">수정</button>
            </div>
        </Box>
    </Modal>
    )
}


export default React.memo(ImgEditModal)