// "use server"

// import serverFetch from "@/app/(commom)/serverFetch";
// import { BoardPreview } from "@/app/(type)/board";
// import axios from "axios";
// import BoardHolder from "./BoardHolder";
// import { IndexPagenation } from "@/app/(type)/Pagenation";

// export default async function Board({
//     params
//   }: {
//     params:{boardMstUUID:string};
//   }){

//     // const fetchData: Recipe[] = await fetch(
//     //     `${process.env.NEXT_PUBLIC_API_URL}recipe/recent-recipe`,
//     //     {
//     //       cache: "no-cache", //수정
//     //     }
//     //   ).then((res) => {
//     //     if (!res.ok) {
//     //       console.log("RecipeDetail fetch error!!", res.status);
//     //     } else {
//     //       return res.json();
//     //     }
//     //   });
//     // const boardData:IndexPagenation<BoardPreview[], number> = await serverFetch({
//     //     url:"board/previews",
//     //     queryParams:{
//     //         sortingCondition:"REAL_TIME",
//     //         boardMstUUID:params.boardMstUUID
//     //     },
//     //     option:{
//     //         cache:"no-cache",
//     //     }
//     // })

//     // console.log("하하하", boardData);

//     return (
//         <div>
//             {/* <BoardHolder initialData={boardData}/> */}
//          </div>
//     )
// }