"use client";

import { useEffect, useState } from "react";
import { randomMenuData } from "./menuData";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RandomMenuRoulette from "./RandomMenuRoulette";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import CasinoIcon from '@mui/icons-material/Casino';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BoltIcon from '@mui/icons-material/Bolt';
import ClearIcon from "@mui/icons-material/Clear";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { OrangeButton } from "@/app/(commom)/Component/Buttons";
import { welcomeEvents } from "@/app/(commom)/ga4/ga4Events";

export default function RandomMenu() {
  const [fullUrl, setFullUrl] = useState("");
  const [secondMenuSelcet, setSecondSelect] = useState<string[]>([]);
  const [firstSelected, setFirstSelected] = useState<string>("전체");
  const [secondSelected, setSecondSelected] = useState<string>("전체");
  const [menuName, setMenuName] = useState<string>("?");
  const [startRotate, setStartRotate] = useState<number>(0);
  const [nowRotating, setNowRotating] = useState<boolean>(false);
  const [immediateLoading, setImmediateLoading] = useState<boolean>(false);
  
  // 5번 클릭 트리거 미니 토스트 State
  const [clickCount, setClickCount] = useState<number>(0);
  const [showWelcomeToast, setShowWelcomeToast] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();

  const firstClick = (menu: string) => {
    setFirstSelected(menu);
  };

  const secondClick = (menu: string) => {
    setSecondSelected(menu);
  };

  useEffect(() => {
    if (firstSelected) {
      if (firstSelected === "전체") {
        setSecondSelect([]);
        return;
      }
      setSecondSelect(["전체", ...Object.keys(randomMenuData[firstSelected])]);
    }
    setSecondSelected("전체");
  }, [firstSelected]);

  const getRandomMenu = () => {
    // 클릭 카운터 1 증가
    setClickCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount > 0 && nextCount % 5 === 0) {
        setShowWelcomeToast(true);
      }
      return nextCount;
    });

    if (firstSelected !== "전체") {
      const menuKeyList = randomMenuData[firstSelected];
      if (secondSelected === "전체") {
        const allMenuList: string[] = [];
        Object.entries(menuKeyList).forEach(([, menuNameList]) => {
          allMenuList.push(...menuNameList);
        });
        const randomInx = Math.floor(Math.random() * allMenuList.length);
        setMenuName(allMenuList[randomInx]);
      } else {
        const menuNameList = menuKeyList[secondSelected];
        const randomInx = Math.floor(Math.random() * menuNameList.length);
        setMenuName(menuNameList[randomInx]);
      }
    } else {
      const allMenuList: string[] = [];
      Object.entries(randomMenuData).forEach(([, value]) => {
        Object.entries(value).forEach(([, menuNameList]) => {
          allMenuList.push(...menuNameList);
        });
      });
      const randomInx = Math.floor(Math.random() * allMenuList.length);
      setMenuName(allMenuList[randomInx]);
    }

    if (!immediateLoading) {
      setNowRotating(true);
      setStartRotate((prv) => prv + 1);
      setTimeout(() => {
        setNowRotating(false);
      }, 2200);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullUrl(`${window.location.origin}${pathname}`);
    }
  }, [pathname]);

  const copyToClip = () => {
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        Swal.fire({
          title: "URL 복사 완료",
          text: "주소가 클립보드에 복사되었습니다.",
          icon: "success",
          confirmButtonColor: "#1c7c54",
          timer: 1500,
        });
      })
      .catch((err) => console.log(err));
  };

  const goToWelcome = () => {
    router.push("/welcome");
  };

  return (
    <div className="w-full max-w-[600px] mx-auto px-4 py-6 text-gray-800 select-none">
      
      {/* Header Banner */}
      <div className="w-full bg-emerald-700 text-white rounded-3xl p-6 sm:p-8 mb-6 shadow-lg text-left relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold text-emerald-50 mb-3">
            <CasinoIcon sx={{ fontSize: 16 }} />
            <span>메뉴 결정 장애 해결</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">랜덤 메뉴 추천</h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium opacity-90 leading-relaxed">
            무엇을 먹을지 고민이신가요?<br />
            원하는 필터를 선택하고 버튼을 눌러보세요!
          </p>
        </div>
      </div>

      <section className="flex flex-col items-center w-full">
        {/* Result Box */}
        <div className="w-full bg-white border border-gray-100 shadow-xl rounded-3xl p-6 mb-6 flex flex-col items-center justify-center relative min-h-[200px]">
          {!nowRotating ? (
            <h2 className="text-2xl font-black text-gray-900">{menuName}</h2>
          ) : (
            <RandomMenuRoulette startRotate={startRotate} rotationTime={2} />
          )}
        </div>

        {/* Filter Selection Section */}
        <div className="w-full p-5 mb-6 text-left">
          <h3 className="text-xs font-black text-gray-400 mb-3 uppercase tracking-wider">식사 종류</h3>
          <div className="flex flex-wrap gap-2 mb-5 flex-center">
            {["전체", "식사", "간식"].map((menu) => {
              const isSelected = menu === firstSelected;
              return (
                <button
                  key={menu}
                  onClick={() => firstClick(menu)}
                  className={`relative flex w-20 justify-center items-center px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                    isSelected ? "border-2 border-emerald-500 text-emerald-600 bg-white shadow-sm" : "border-gray-200 text-gray-600"
                  }`}
                >
                  {isSelected && <CheckCircleIcon sx={{ fontSize: 16 }} className="absolute right-1 top-0 text-emerald-500" />}
                  {menu}
                </button>
              );
            })}
          </div>

          {secondMenuSelcet.length > 0 && (
            <>
              <h3 className="text-xs font-black text-gray-400 mb-3 uppercase tracking-wider">세부 분류</h3>
              <div className="flex flex-wrap gap-2  flex-center">
                {secondMenuSelcet.map((menu) => {
                  const isSelected = menu === secondSelected;
                  return (
                    <button
                      key={menu}
                      onClick={() => secondClick(menu)}
                      className={`relative flex w-20  justify-centeritems-center px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        isSelected ? "border-2 border-emerald-500 text-emerald-600 bg-white shadow-sm" : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {isSelected && <CheckCircleIcon sx={{ fontSize: 16 }} className="absolute right-1 top-0 text-emerald-500" />}
                      {menu}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons Group */}
        <div className="w-full flex flex-col gap-3 items-center">
          
          {/* Main Action Button (공용 주황색 OrangeButton 사용) */}
          <OrangeButton
            fullWidth
            size="lg"
            onClick={getRandomMenu}
            disabled={nowRotating}
            className="py-4 text-sm font-extrabold shadow-md"
          >
            <CasinoIcon sx={{ fontSize: 20 }} />
            <span>{!nowRotating ? "무엇을 먹을까?" : "메뉴 뽑는 중..."}</span>
          </OrangeButton>

          {/* Sub Option: Immediate view toggle */}
          <button
            onClick={() => setImmediateLoading((prev) => !prev)}
            className={`w-full py-3 text-xs font-bold rounded-2xl border cursor-pointer transition-all flex items-center justify-center gap-1.5 outline-none ${
              immediateLoading
                ? "border-emerald-500 bg-emerald-500 hover:bg-emerald-700 text-white shadow-xs"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <BoltIcon sx={{ fontSize: 18 }} />
            <span>{immediateLoading ? "바로 보기 켜짐" : "로딩 없이 바로 보기"}</span>
          </button>

          {/* Secondary Actions: URL Copy */}
          <div className="w-full flex gap-2 mt-1">
            <button
              onClick={copyToClip}
              className="flex-1 py-3 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-1.5 outline-none shadow-xs"
            >
              <ContentCopyIcon sx={{ fontSize: 16 }} />
              <span>URL 복사</span>
            </button>
          </div>

          {/* Welcome link */}
          <button
            onClick={()=>{
                goToWelcome();
                welcomeEvents.goToWelcome("하단 버튼");
              }
            }
            className="mt-3 text-xs text-gray-400 font-medium hover:text-emerald-600 transition-colors underline underline-offset-4 border-none bg-transparent cursor-pointer"
          >
            서비스 소개
          </button>

        </div>
      </section>

      {/* 우측 구석 방해 없는 미니 팝업 토스트 (5번 클릭 시마다 팝업) */}
      {showWelcomeToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-md border border-emerald-200/80 shadow-[0_12px_32px_rgba(0,0,0,0.12)] rounded-2xl p-4 max-w-[280px] w-full text-left transition-all animate-fade-in-up flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
              <InfoOutlinedIcon sx={{ fontSize: 13 }} />
              <span>머그인 안내</span>
            </div>
            <button
              onClick={() => setShowWelcomeToast(false)}
              className="w-5 h-5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center border-none bg-transparent cursor-pointer"
            >
              <ClearIcon sx={{ fontSize: 14 }} />
            </button>
          </div>

          <p className="text-xs text-gray-700 font-medium leading-snug">
            이 사이트가 무슨 서비스를 제공하는 지 알고 계신가요?
          </p>

          <button
            onClick={() => {
              setShowWelcomeToast(false);
              goToWelcome();
              welcomeEvents.goToWelcome("하단 팝업");
            }}
            className="w-full py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200/60 transition-colors cursor-pointer outline-none text-center"
          >
            서비스 소개 구경하기 &rarr;
          </button>
        </div>
      )}
    </div>
  );
}