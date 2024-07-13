import { cookies } from "next/headers";
import RecentRecipes from "./RecentRecipes";
import SeasonalFood from "./SeasonalFood";
import SearchBar from "./SearchBar";
import IntervalConfig from "./(interval)/intervalConfig";
import RealTimeLikeBoard from "./(board)/(realTime)/RealTimeLikeBoard";

export default function Home() {
  console.log(cookies().get("test"));
  return (
    <div className="bg-white w-full flex flex-col justify-center items-center">
      <SearchBar></SearchBar>
      <SeasonalFood></SeasonalFood>
      <RecentRecipes></RecentRecipes>
      <RealTimeLikeBoard></RealTimeLikeBoard>
    </div>
  );
}
