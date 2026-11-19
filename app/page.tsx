import RecentRecipes from "./(recipe)/(realTime)/RecentRecipes";
import SiteDescription from "./SiteDescription";
import { Metadata } from "next";
import FridgeDescription from "./FridgeDescription";
import PopularRecipes from "./(recipe)/(realTime)/PopularRecipes";
import CategoryHubSection from "./(recipe)/(realTime)/CategoryHubSection";
import BottomBanner from "./(commom)/Component/BottmomBanner";
import IngredientSection from "./IngredientSection";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mug-in.com";

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(SITE_URL),
    title: "머그인 - 레시피 & 스마트 냉장고",
    description: "재료를 공유하고 관리하고 소비해요. 낭비없는 삶 머그인",
    alternates: {
      canonical: SITE_URL,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/common/favicon.png", type: "image/png", sizes: "192x192" },
      ],
      shortcut: "/common/favicon.png",
      apple: "/common/favicon.png",
    },
    openGraph: {
      title: "머그인 - 레시피 & 스마트 냉장고",
      description: "재료를 공유하고 관리하고 소비해요. 낭비없는 삶 머그인",
      url: SITE_URL,
      siteName: "머그인",
      images: [
        {
          url: `${SITE_URL}/common/favicon.png`,
          width: 512,
          height: 512,
          alt: "머그인 메인",
        },
      ],
    },
  };
}

export default function Home() {
  return (
    <div className="bg-white w-full flex flex-col justify-center items-center">
      <SiteDescription></SiteDescription>
      <FridgeDescription></FridgeDescription>
      <IngredientSection />
      <CategoryHubSection />
      <PopularRecipes />
      <RecentRecipes />
      <BottomBanner />
    </div>
  );
}
