import DietSquareItem from "@/app/(board)/board/[boardMenuId]/create/(Diet)/DietSquareItem";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { DietDay } from "@/app/(type)/diet";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FeedDiet({
  userNickName,
}: {
  userNickName: String;
}) {
  const [myDiets, setMyDiets] = useState<DietDay[]>([]);

  useEffect(() => {
    axiosAuthInstacne
      .get(`diet/day/user-days?userNickName=${userNickName}`)
      .then((res) => {
        setMyDiets(res.data);
      })
  }, []);

  const feedInfos = myDiets.map((diet, inx) => (
    <Link
      key={inx}
      href={`/diet/mydiet/${diet.dietDayId}`}
    >
      <DietSquareItem dietDay={diet}/>
    </Link>
  ));

  return (
    <div className="h-screen w-full">
      <ul className="grid grid-cols-3 w-full gap-1 p-2">
        {feedInfos}
      </ul>
    </div>
  )
}
