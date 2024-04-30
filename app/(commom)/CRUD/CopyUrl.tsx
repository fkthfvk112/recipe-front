"use client"
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { usePathname } from 'next/navigation'

export default async function CopyUrl(){
    const pathname = usePathname()//have to :: 앞에 도메인 넣기. 현재 /fdsfsd?=fsdfsd형태로만 복사됌
    const copyToClip = ()=> {
        navigator.clipboard.writeText(pathname)
            .then(() => {
        })
            .catch(err => {
        })}

    return(
        <ContentCopyIcon className='hover-pointer m-2' onClick={copyToClip}></ContentCopyIcon>
    )
}