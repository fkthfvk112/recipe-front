import DietSquareItem from "@/app/(board)/board/[boardMenuId]/create/(Diet)/DietSquareItem";
import DietVerticalItem from "@/app/(board)/board/[boardMenuId]/create/(Diet)/DietVerticalItem";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { DietDay } from "@/app/(type)/diet";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function MyDiet() {
  const [myDiets, setMyDiets] = useState<DietDay[]>([]);

  useEffect(() => {
    axiosAuthInstacne
      .get(`diet/day/my-days`)
      .then((res) => {
        setMyDiets(res.data);
      })
      .catch((err) => {
        console.log("아시오스 에러", err);
      });
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
      <ul className="grid grid-cols-3 w-full gap-3 p-2">
        {feedInfos}
      </ul>
    </div>
  )
}
