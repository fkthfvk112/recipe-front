import { cookies } from "next/headers";
import RecentRecipes from "./RecentRecipes";
import SeasonalFood from "./SeasonalFood";

export default function Home() {
  console.log(cookies().get("test"));
  return (
    <div className="bg-white w-full flex flex-col justify-center items-center">
      <SeasonalFood></SeasonalFood>
      <RecentRecipes></RecentRecipes>홈<button>버튼</button>
    </div>
  );
}
