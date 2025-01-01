"use client"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { usePathname } from 'next/navigation'
import Swal from 'sweetalert2';

export default function CopyUrl(){
    const pathname = usePathname()
    const fullUrl = `${window.location.origin}${pathname}`;

    const copyToClip = ()=> {
        navigator.clipboard.writeText(fullUrl)
            .then(() => {
                Swal.fire({
                    title:"URL 복사 완료",
                    text: "URL이 클립보드에 복사되었습니다.",
                    showConfirmButton:false,
                    timer:1500
                });
        })
            .catch(err => {
        })}

    return(
        <ContentCopyIcon className='hover-pointer m-2' onClick={copyToClip}></ContentCopyIcon>
    )
}