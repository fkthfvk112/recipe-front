"use client"

import { IndexPagenation } from "@/app/(type)/Pagenation";
import { BoardPreview } from "@/app/(type)/board";
import React, { useState } from "react";
import BoardPreviewHoriItem from "../../BoardPreviewHoriItem";

function BoardHolder({initialData}:{initialData:IndexPagenation<BoardPreview[], number>}){
    const [data, setData] = useState<BoardPreview[]>(initialData.data);

    console.log("d이니셜 데이터", data);
    
    // const initialDatas = data?.map((ele)=>{
    //     return <BoardPreviewHoriItem boardPreview={ele}/>
    // })

    return (
        <div className="w-full h-full">
            {/* {initialDatas} */}
        </div>
    )
}

export default React.memo(BoardHolder);