import RecentRecipes from "./(recipe)/(realTime)/RecentRecipes";
import SeasonalFood from "./SeasonalFood";
import SearchBar from "./SearchBar";
import RealTimeLikeBoard from "./(board)/(realTime)/RealTimeLikeBoard";
import PopularRecipes from "./(recipe)/(realTime)/PopularRecipes";
import SiteDescription from "./SiteDescription";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "머그인",
    description:"재료를 공유하고 관리하고 소비해요. 낭비없는 삶 머그인",
    icons:{
      icon:"/common/favicon.png"
    },
    openGraph:{
      title: "머그인",
      description:"재료를 공유하고 관리하고 소비해요. 낭비없는 삶 머그인",
    }
  }
}
 
export default function Home() {
  return (
    <div className="bg-white w-full flex flex-col justify-center items-center">
      <SearchBar></SearchBar>
      <SiteDescription></SiteDescription>
      <SeasonalFood></SeasonalFood>
      <PopularRecipes></PopularRecipes>
      <RecentRecipes></RecentRecipes> 
      <RealTimeLikeBoard></RealTimeLikeBoard>
    </div>
  );
}
