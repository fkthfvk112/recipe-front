"use server"
import { DietDay } from "@/app/(type)/diet";
import DietDayShowBox from "./DietDayShowBox";
import { authFetch, } from "@/app/(customAxios)/authFetch";
import EditDel from '@/app/(commom)/CRUD/EditDel';
import { Metadata, ResolvingMetadata } from 'next';
import LockIcon from '@mui/icons-material/Lock';

type Props = {
  params: Promise<{ dietId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const dietId = (await params).dietId
  
  const dietDay:DietDay|undefined = await authFetch(`diet/day/my-day?dietId=${dietId}`);


  //const image = boardData?.photos && boardData.photos.length >= 1 ? boardData.photos[0] : "/common/favicon.png";
 
  let image = "/common/favicon.png";
  let title = "머그인 - 나의 식단";
  let desc = "내 오늘의 식단을 공유하는 페이지입니다. 오늘의 식단을 작성하고 게시판을 통해 공유해보세요!";
  if(dietDay?.isPublic){
    const tempImg = dietDay.dietItemRowList[0]?.photo;
    image = tempImg.length >= 10 ? "/common/favicon.png":image;

    title = dietDay?.title ? dietDay.title:title
    desc = dietDay?.memo ? dietDay.memo : desc
  }

  return {
    title: title,
    description:desc,
    icons:{
      icon:"/common/favicon.png"
    },
    openGraph:{
      title: dietDay?.title ? dietDay.title:"머그인 - 나의 식단",
      description:desc,
      images:image
    }
  }
}

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
  
    const dietItems = dietDay?.dietItemRowList?.map((dietRow, inx) =>
      <div className="col-span-1 aspect-auto" key={inx}>
        <DietDayShowBox title={dietRow.title?dietRow.title:""} dietItemRow={dietRow}/>
      </div>
    );

    console.log("이퍼 ", dietDay);

    return (
      dietDay&&
      <div className='w-full bg-[#1d3124]  flex flex-col justify-center items-center pt-14'>
        <div className="max-w-xl bg-white pt-10 pb-10 mb-20 border shadow-xl flex flex-col flex-wrap w-full justify-center items-center rounded-xl">
            <div className="relative w-[93%] flex justify-start items-center">
              {
                (!dietDay?.isPublic)&&
                <LockIcon className="w-[35px] h-[35px] mb-3"/>
              }
              <h1 className="text-2xl mb-2">{dietDay.title}</h1>
              <EditDel ownerUserId={dietDay.userId as string} editReturnURl={`diet/mydiet/edit/${params.dietId}`} 
                delPostUrl={`diet/day/my-day/del?dietDayId=${params.dietId}`} delReturnUrl='/userfeed/myfeed'/>
            </div>
            {
            dietDay.memo&&
            <div className="w-[93%] bg-stone-100 rounded-lg p-3">
                <div className="text-lg">{dietDay.memo}</div>
            </div>
            }

            <div className="grid grid-cols-2 mt-10 gap-1 w-full p-3">
              {dietItems}
            </div>
        </div>
    </div>
    )
  }