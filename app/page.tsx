import RecentRecipes from "./(recipe)/(realTime)/RecentRecipes";
import SeasonalFood from "./SeasonalFood";
import SearchBar from "./SearchBar";
import RealTimeLikeBoard from "./(board)/(realTime)/RealTimeLikeBoard";
import PopularRecipes from "./(recipe)/(realTime)/PopularRecipes";
import SiteDescription from "./SiteDescription";

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
