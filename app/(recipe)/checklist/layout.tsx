import { Metadata } from "next";

export const metadata: Metadata = {
  title: "장보기 체크리스트 - 펜션·캠핑·자취·추석 명절 추천 프리셋 | 머그인",
  description:
    "MBTI J의 1박 2일 펜션 장보기, 캠핑 바베큐, 자취생 첫 장보기, 추석 명절 차례상까지! 상황별 맞춤 추천 프리셋을 원클릭으로 담고 스마트하게 체크하세요.",
  keywords: [
    "장보기 체크리스트",
    "펜션 장보기 리스트",
    "캠핑 바베큐 장보기",
    "자취 첫 장보기",
    "추석 명절 장보기",
    "장보기 목록",
    "식재료 체크리스트",
    "머그인",
  ],
  openGraph: {
    title: "장보기 체크리스트 - 펜션·캠핑·자취·추석 명절 추천 프리셋 | 머그인",
    description:
      "상황별 필수 식재료를 원클릭으로 담는 스마트 장보기 체크리스트. MBTI J 펜션, 캠핑 BBQ, 자취생 필수, 추석 명절 프리셋 제공!",
    type: "website",
  },
};

export default function ChecklistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "머그인 스마트 장보기 체크리스트",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "All",
        "description":
          "살 것을 잊지 않도록 식재료를 등록하고 체크하는 무료 온라인 장보기 체크리스트. MBTI J 펜션, 캠핑 BBQ, 자취생 필수, 추석 명절 추천 프리셋 원클릭 지원.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "KRW",
        },
      },
      {
        "@type": "ItemList",
        "name": "상황별 맞춤 장보기 추천 프리셋 목록",
        "description": "상황에 딱 맞는 식재료를 원클릭으로 장바구니에 담을 수 있는 추천 체크리스트 목록",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "MBTI J의 1박 2일 펜션·글램핑 여행 식재료 체크리스트",
            "description": "1박 2일 펜션·글램핑 여행 시 빼놓기 쉬운 바베큐 고기, 양념, 햇반, 쌈채소 완벽 체크리스트",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "추석 명절 장보기 & 차례상 식재료 체크리스트",
            "description": "추석 명절 차례상 및 가족 친지 모임 요리에 필요한 나물, 전, 갈비찜 핵심 식재료 완벽 준비",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "불멍 & 감성 캠핑 BBQ 장보기 필수 팩",
            "description": "캠핑 바베큐와 불멍 야식, 그리들 요리에 필수적인 고기, 양념, 밀키트 모음",
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "자취생 첫 장보기 필수 식재료 모음집",
            "description": "초보 자취생 필수 양념, 오랫동안 보관 가능한 기본 밑반찬 식재료 스타터팩",
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "주말 홈파티 & 밀푀유나베 필수 식재료",
            "description": "손님 초대 홈파티 및 뜨끈한 전골/밀푀유나베 재료 한번에 준비하기",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
