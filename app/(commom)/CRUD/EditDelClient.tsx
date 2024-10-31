"use client"
import EditNoteIcon from '@mui/icons-material/EditNote';
import Swal from "sweetalert2";
import { Box, Modal } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { axiosAuthInstacne } from '@/app/(customAxios)/authAxios';
import { EditDel } from './EditDel';
import { revalidateByTagName } from '@/app/(utils)/revalidateServerTag';
import usePreventGoBack from '../Hook/usePreventGoBack';

const style = {
    border:'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '80%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'transparente',
};

export interface EditDelClient{
  editReturnURl:string,
  delPostUrl:string,
  delReturnUrl:string,
  revalidateTagName?:string,
}

export default function EditDelClient({editReturnURl, delPostUrl, delReturnUrl, revalidateTagName}:EditDelClient){
    const router = useRouter();
    const [openModal, setOpenModal] = useState<boolean>(false);
    usePreventGoBack({callback:()=>{setOpenModal(false)}, useCondition:openModal})

    const sendToEditPage = ()=>{
        if(editReturnURl === undefined) return;
        router.push(`/${editReturnURl}`);
    }

    const deleteData = ()=>{
        Swal.fire({
            title: "삭제하시겠습니까?",
            text: "삭제하면 되돌릴 수 없어요. 정말 삭제하시겠어요?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
            confirmButtonColor: '#d33',
          }).then((result) => {
            if (result.isConfirmed) {
              axiosAuthInstacne
                .delete(delPostUrl)
                .then((res) => {
                  Swal.fire({
                    title: "삭제 완료",
                    icon: "success",
                  }).then(() => {
                    if(revalidateTagName){
                      revalidateByTagName(revalidateTagName);
                    }
                    router.push(delReturnUrl);
                  });
                })
            }
          });          
    }

    return (
      <>
        <EditNoteIcon className='hover-pointer m-2' onClick={()=>setOpenModal(!openModal)}/>
        <Modal
        open={openModal}
        onClose={()=>setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
             <Box sx={style}>
                <div className='flex flex-col w-full justify-center bg-white rounded-3xl'>
                    <button onClick={deleteData} className='w-full border-none text-red-600'>삭제하기</button>
                    <button onClick={sendToEditPage} className='w-full border-none'>수정하기</button>
                </div>
                <div className='flex w-full justify-center mt-2 bg-white rounded-3xl'>
                    <button onClick={()=>setOpenModal(false)} className='w-full border-none'>취소</button>
                </div>
            </Box>
        </Modal>
      </>
    )
}