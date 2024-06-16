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
      className="flex justify-center items-center relative w-1/3 aspect-square p-0.5"
      key={inx}
      href={`/diet/mydiet/${diet.dietDayId}`}
    >
    <DietVerticalItem dietDay={diet}/>
    </Link>
  ));

  return <div className="flex flex-wrap w-full">{feedInfos}</div>;
}
