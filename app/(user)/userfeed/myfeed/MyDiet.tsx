import DietVerticalItem from "@/app/(board)/board/create/[boardMstUUID]/(Diet)/DietVerticalItem";
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
      className="flex justify-center items-center"
      key={inx}
      href={`/diet/mydiet/${diet.dietDayId}`}
    >
      <DietVerticalItem dietDay={diet}/>
    </Link>
  ));

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="flex justify-center items-center flex-wrap w-full p-2">
        {feedInfos}
      </div>
    </div>
  )
}
