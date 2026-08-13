"use client"

import Image from "next/image";
import { CookingSteps_show } from "../../types/recipeType";
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import { useState } from "react";
import ImgModal from "@/app/(commom)/Component/ImgModal";

export default function RecipeStepInfo({
  steps,
}: {
  steps: CookingSteps_show[];
}) {
  const [modalImg, setModalImg]  = useState<string>("");
  const [modalOpen, openImgModal] = useState<boolean>(false);

  const clickImgModalOpen = (imgStr:string|null|undefined)=>{
    if(!imgStr) return;
    setModalImg(imgStr);
    openImgModal(true);
  }

  const stepItems = steps.map((step, inx) => {
    return (
      <div key={inx} className="py-4 border-b border-gray-100 last:border-b-0">
        <div className="flex justify-between items-center mb-2.5 text-sm sm:text-base font-bold">
          <span className="text-gray-800 font-black text-[15px] sm:text-[16px]">Step {step.order+1}</span>
          <span className="inline-flex items-center text-xs font-semibold text-gray-400">
            <AccessAlarmsIcon sx={{ fontSize: 16, marginRight: "3px", color: "#9CA3AF" }} />
            {step.time}분
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className={`${step.photo?'col-span-2':'col-span-3'} py-1 text-[14px] text-gray-600 leading-relaxed break-words break-keep whitespace-pre-wrap`}>
            {step.description}
          </div>
          {step.photo &&
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
              <Image 
                className="object-cover" 
                src={step.photo} 
                fill 
                sizes="(max-width: 768px) 100vw, 200px"
                alt={`Step ${step.order+1} image`} 
                onClick={()=>clickImgModalOpen(step.photo)}
              />
            </div>
          }
        </div>
      </div>
    );
  });

  return (
    <>    
    <div className="w-full mt-10">
      <div className="flex justify-start border-b border-gray-100 pb-3 mb-4 px-2">
        <h2 className="text-lg font-black text-gray-800 tracking-tight">요리 순서</h2>
      </div>
      <div className="space-y-2">
        {stepItems}
      </div>
    </div>
    <ImgModal modalOpen={modalOpen} setModalOpen={openImgModal} modalImg={modalImg}/>
    </>
  );
}
