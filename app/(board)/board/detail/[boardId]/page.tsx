"use server"

import serverFetch from "@/app/(commom)/serverFetch"
import { Board } from "@/app/(type)/board"
import { extractDateTime } from "@/app/(utils)/DateUtil";
import Image from "next/image";
import Link from "next/link";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CopyUrl from "@/app/(commom)/CRUD/CopyUrl";
import EditDel from "@/app/(commom)/CRUD/EditDel";
import HeartLike from "@/app/(commom)/CRUD/HeartLike";
import ReviewContainer from "@/app/(recipe)/recipe-detail/(review)/ReviewContainer";

export default async function BoardDetail({
    params
  }: {
    params:{boardId:number};
  }){

    const boardData:Board = await serverFetch({
        url:"board/detail",
        queryParams:{
            boardId:params.boardId
        },
        option:{
            cache:"no-cache",
        }
    })
    console.log("데이터", boardData);

    const anonymousUser = <div className="flex">
                            <AccountCircleIcon sx={{width:"50px", height:"50px"}}/>
                            {/* have to :: 수정: 사진 받을 수 있도록, 유저 닉네임 -> 유저 유니크 아이디로 로직 변경 */}
                            <div className="ms-3">
                                <h3>익명</h3>
                                <p className="text-sm text-[#a1a1a1]">
                                    {extractDateTime(boardData.createdAt as string)}
                                </p>
                            </div>
                        </div>
    
    const identityUser =  <div className="flex justify-start items-center mb-3">
                                {boardData.userPhoto?
                                 <Image className="rounded-full" src={boardData.userPhoto} width={50} height={50} alt="Picture of the author" loading="lazy"/>:
                                 <AccountCircleIcon sx={{width:"50px", height:"50px"}}/>}
                                <div className="ms-3">
                                    <Link href={`/userfeed/${boardData.userNickName}`}>
                                        <h3>{boardData.userNickName}</h3>
                                    </Link>
                                    <p className="text-sm text-[#a1a1a1]">
                                        {extractDateTime(boardData.createdAt as string)}
                                    </p>
                                </div>
                            </div>

    return(
        <section className="defaultInnerContainer" style={{paddingLeft:'1rem', paddingRight:'1rem'}}>
            {boardData.userNickName === "익명"? anonymousUser:identityUser}
            <div className="bottom-line">
                <h1>{boardData.title}</h1>
            </div>
            <p className="mb-12 mt-5">
                {boardData.content}
            </p>
            <div className="flex w-full pt-1 pb-1 text-left">
                <HeartLike getUrl={`like/board/like-state?boardId=${params.boardId}`} putUrl="like/board/toggle" reqdata={{boardId:params.boardId}}/>
                <CopyUrl></CopyUrl>
                {/* have to : user ID -> user uuid */}
                <EditDel ownerUserId={boardData.userId} editReturnURl="/" delPostUrl="/" delReturnUrl="/"/>
            </div>
            <ReviewContainer domainId={params.boardId} domainName="board"/>
        </section>
    )
}