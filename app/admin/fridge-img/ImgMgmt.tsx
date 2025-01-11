import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { FridgeImg } from "@/app/(type)/fridge";
import Image from "next/image";
import { useEffect, useReducer, useState } from "react";
import styles from "./adminFrdge.module.css"
import { extractDate } from "@/app/(utils)/DateUtil";
import ImgEditModal from "./ImgEditModal";

export default function ImgMgmt(){
    const [imgSort, setImgSort] = useState<string>("");
    const [imgs, setImgs] = useState<FridgeImg[]>([]);

    //모달
    const [modalSelectImg, setModalSelectImg] = useState<FridgeImg>({
        imgName:"디폴트",
        imgUrl:"",
        createdAt:"",
        imgSort:""
    });
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [toggle, refetcher] = useReducer((state:boolean)=>!state, false);

    useEffect(()=>{
            axiosAuthInstacne.get(`admin/fridge/item/image?sort=${imgSort}`)
                .then((res)=>{
                    setImgs(res.data);
                })
    }, [toggle])

    const imgList = imgs.map((img, inx)=>
        (<tr key={inx}>
            <td className="w-[60px]">
                <Image
                    src={img.imgUrl}
                    width={60}
                    height={60}
                    alt=""
                />
            </td>
            <td>{img.imgName}</td>
            <td>{img.imgSort}</td>
            <td>{extractDate(img.createdAt)}</td>
            <td>
                <button onClick={()=>{
                        setModalSelectImg(img);
                        setEditModalOpen(true);
                    }} className="greenBtn w-12 text-xs">수정</button>
            </td>
        </tr>))


    return(
        <section className="w-full overflow-x-scroll">
            <TitleDescription title="이미지 관리" desc={"등록된 냉장고 이미지"}/>            
            <table className={`w-full ${styles.searchTalble}`} >
                <tr className="text-center font-bold">
                    <td>이미지</td>
                    <td>이미지명</td>
                    <td>분류</td>
                    <td>생성일</td>
                    <td>수정</td>
                </tr>
                {imgList}
            </table>
            <ImgEditModal imgItem={modalSelectImg} refetcher={refetcher} open={editModalOpen} setOpen={setEditModalOpen} />
        </section>
    )
}