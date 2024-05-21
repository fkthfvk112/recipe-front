"use client"
import EditNoteIcon from '@mui/icons-material/EditNote';
import Swal from "sweetalert2";
import { Box, Modal } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { axiosAuthInstacne } from '@/app/(customAxios)/authAxios';

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

  

export default function EditDelClient({editReturnURl, delPostUrl, delReturnUrl}:{ editReturnURl:string, delPostUrl:string, delReturnUrl:string}){
    const router = useRouter();
    const [openModal, setOpenModal] = useState<boolean>(false);

    const sendToEditPage = ()=>{
        if(editReturnURl === undefined) return;
        router.push(`/${editReturnURl}`);
    }

    const deleteData = ()=>{
        Swal.fire({
            title: "정말로 삭제하시겠습니까?",
            text: "삭제하면 되돌릴 수 없어요. 정말 삭제하시겠어요?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제할래요.",
            cancelButtonText: "아니요!",
            confirmButtonColor: '#d33',
          }).then((result) => {
            if (result.isConfirmed) {
              axiosAuthInstacne
                .delete(delPostUrl)
                .then((res) => {
                  Swal.fire({
                    title: "삭제가 완료되었습니다!",
                    icon: "success",
                  }).then(() => {
                    router.push(delReturnUrl);
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire("걱정마요. 안전해요!");
            }
          });          
    }

    return <>
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
                    <hr />
                    <button onClick={sendToEditPage} className='w-full border-none'>수정하기</button>
                </div>
                <div className='flex w-full justify-center mt-2 bg-white rounded-3xl'>
                    <button onClick={()=>setOpenModal(false)} className='w-full border-none'>취소</button>
                </div>
            </Box>
        </Modal>

        </>
}