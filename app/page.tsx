import { cookies } from "next/headers";
import RecentRecipes from "./RecentRecipes";

export default function Home() {
  console.log(cookies().get("test"));

  //    <div className="bg-[#ca8a04] w-full">

  return (
    <div className="bg-white w-full flex flex-col justify-center items-center">
      <RecentRecipes></RecentRecipes>홈<button>버튼</button>
    </div>
  );
}
