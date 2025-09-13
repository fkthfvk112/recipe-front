"use client"

import FeatureSection from "./FeatureSection";
import WelcomeHead from "./WelcomHead";
import WelcomTrouble from "./WelcomTrouble";
import ClosingSection from "./ClosingSection";
import { useRouter } from "next/navigation";

export default function Welcom(){
    const router = useRouter();

    const goToLogin = () => router.push("/signin");

    const features = [
        {
        title: "냉장고 관리",
        description: "냉장고 속 재료의 유통기한을 한눈에 확인할 수 있어요",
        iconUrl: "/welcom/frigo_mgmt.png",
        },
        {
        title: "레시피 추천",
        description: "냉장고 속 재료로 만들 수 있는 요리를 추천받아요",
        iconUrl: "/welcom/recommend_recipe.png",
        },
        {
        title: "레시피 공유",
        description: "나만의 요리를 기록하고 공유해요",
        iconUrl: "/welcom/food.png",
        },
        {
        title: "게시글",
        description: "다른 사람들과 경험을 나누고 소통해요",
        iconUrl: "/welcom/write_post.png",
        },
        {
        title: "식단 기록",
        description: "매일의 식단을 기록하고 건강한 습관을 만들어요",
        iconUrl: "/welcom/write_diet.png",
        },
    ];

    return(
        <div className='w-full bg-white flex flex-col justify-start items-center min-h-dvh'>    
            <div className="bg-white max-w-4xl w-dvw m-3 bg-white flex flex-col justify-center items-center rounded-lg">
                <WelcomeHead
                    title="더 산뜻한 내일을 위해"
                    description="식재료 유통기한을 관리하고 레시피를 추천받아 효율적으로 소비해요."
                    imgUrl="/welcom/eat.png"
                    ctaText="3초 만에 시작하기"
                    onCtaClick={goToLogin}
                />
                <FeatureSection
                    features={features}
                    heading="어떤 서비스인가요?"
                    subheading="머그인은 냉장고 속 식재료를 관리하고 레시피를 공유하는 서비스에요."
                />
                <WelcomTrouble
                    problemTitle="지금 냉장고 속에 뭐있게요"
                    problemTexts={[
                        "저는 종종 샐러드용 야채를 샀다가 며칠 뒤 냉장고 속 시든 야채를 발견하고는 했어요.", 
                        "돈과 건강을 생각해 요리를 하지만, 남은 식재료는 어떤 게 있는지 까먹고는 했어요.", 
                        "특히 냉동실! 지금 냉동실 안에 뭐가 있는지 다 기억 못하실 걸요?"
                    ]}
                    solutionTitle="냉장고를 관리해보자"
                    solutionTexts={[
                        "그래서 냉장고 관리 서비스를 만들었어요.",
                        "남은 식재료 촉진을 위해 레시피 추천 및 공유 기능을 추가했죠.", 
                        "이제 이 기능을 여러분과 함께하고 사용하고 싶어요."
                    ]}
                    problemImg="welcom/worry_fridge.png"
                    solutionImg="welcom/ohho.png"
                    valueTitle="이런 효과를 기대해요"
                    value={[
                        "식재료 낭비를 줄이고 지갑과 환경을 지켜요.",
                        "식단을 기록하여 건강한 생활 습관을 만들어요.",
                        "레시피 공유하며 직접 요리하는 습관을 들여요.",
                    ]}
                />
                <ClosingSection
                    message="지금 함께해요"
                    ctaText="같이 건강해지기"
                    onCtaClick={goToLogin}
                />
                {/* <WelcomFooter/> */}
            </div> 
        </div>
    )

}