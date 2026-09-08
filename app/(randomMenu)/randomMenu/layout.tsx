import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mug-in.com";

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(SITE_URL),
    title: "랜덤 메뉴 추천 - 머그인",
    description: "무엇을 먹을지 고민이신가요? 메뉴를 선택하고 무엇을 먹을까? 버튼을 눌러 보세요. 다양한 메뉴 추천을 도와줄게요.",
    alternates: {
      canonical: `${SITE_URL}/randomMenu`,
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
      title: "랜덤 메뉴 추천 - 머그인",
      description: "무엇을 먹을지 고민이신가요? 메뉴를 선택하고 무엇을 먹을까? 버튼을 눌러 보세요.",
      url: `${SITE_URL}/randomMenu`,
      siteName: "머그인",
      images: [
        {
          url: `${SITE_URL}/common/favicon.png`,
          width: 512,
          height: 512,
          alt: "랜덤 메뉴 추천 - 머그인",
        },
      ],
    },
  };
}

export default function RecipeLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <main className="defaultInnerContainer-noPTop">
      {children}
    </main>
  );
}
