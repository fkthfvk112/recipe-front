"use server"
import { cookies } from 'next/headers'
import { DietDay } from "@/app/(type)/diet";
import DietDayShowBox from "./DietDayShowBox";
import { authFetch, } from "@/app/(customAxios)/authFetch";
import EditDel from '@/app/(commom)/CRUD/EditDel';

export default async function DietDetail({
    params,
  }: {
    params: { dietId: string };
  }) {
    //const [dietDeitDay, setMyDietDay] = useState<DietDay>();

    //공통으로 사용할 것이다.
    //공개 된 것만 공개해야한다.
    //하지만 유저는 다 볼 수 있어야한다.
    //다이어트 폼을 공통으로 사용하자.

      const dietDay:DietDay|undefined = await authFetch(`diet/day/my-day?dietId=${params.dietId}`);
      console.log(dietDay);

  
     const dietItems = dietDay?.dietItemRowList?.map((dietRow, inx) => 
       <DietDayShowBox key={inx} title={dietRow.title?dietRow.title:""} dietItemRow={dietRow}/>);


    return (
      dietDay&&
      <div className="bg-white max-w-xl m-3 flex flex-col flex-wrap w-full justify-center items-center">
        <div className="w-80 flex justify-start items-center">
            <h1 className="text-2xl">{dietDay.title}</h1>
            <EditDel ownerUserId={dietDay.userId as string} editReturnURl={`diet/mydiet/edit/${params.dietId}`} delPostUrl={`diet/day/my-day/del?dietDayId=${params.dietId}`} delReturnUrl='/userfeed/myfeed'/>
        </div>
        <div className="w-80 mt-5">
            <div className="text-lg">{dietDay.memo}</div>
        </div>
        <div className="flex flex-wrap justify-center items-center">
          {dietItems}
        </div>
      </div>
    )
  }