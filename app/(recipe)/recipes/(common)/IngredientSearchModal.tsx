"use client";

import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchFridgeImages } from "@/app/(api)/fridge";
import { defaultAxios } from "@/app/(customAxios)/authAxios";
import { FridgeItem } from "@/app/(type)/fridge";

interface IngredientSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalIngredients: string[];
  setModalIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit: () => void;
  isSignIn: boolean;
  fridgeIngredients: string[];
}

export default function IngredientSearchModal({
  isOpen,
  onClose,
  modalIngredients,
  setModalIngredients,
  onSubmit,
  isSignIn,
  fridgeIngredients
}: IngredientSearchModalProps) {
  const [imgSort, setImgSort] = useState<string>("전체");
  
  const [ingreInput, setIngreInput] = useState<string>("");
  const [recommendList, setRecommendList] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  
  const [isFridgeExpanded, setIsFridgeExpanded] = useState<boolean>(false);

  const { data: fridgeImgs = [], isLoading } = useQuery<FridgeItem[]>({
    queryKey: ["fridgeImages"],
    queryFn: fetchFridgeImages,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (ingreInput.trim().length === 0) {
      setRecommendList([]);
      return;
    }
    const timer = setTimeout(() => {
      defaultAxios.get("ingre-list/recommend/redis", {
        params: { searchingTerm: ingreInput }
      }).then((res) => {
        if (res.data) {
          setRecommendList(res.data);
        }
      }).catch(err => console.log("Redis recommendation fetch error", err));
    }, 150);

    return () => clearTimeout(timer);
  }, [ingreInput]);

  if (!isOpen) return null;

  const toggleIngredientToken = (name: string) => {
    if (modalIngredients.includes(name)) {
      setModalIngredients(prev => prev.filter(v => v !== name));
    } else {
      if (modalIngredients.length >= 10) return;
      setModalIngredients(prev => [...prev, name]);
    }
  };

  const handleReset = () => {
    setModalIngredients([]);
  };

  const sortBtns = [
    "전체", "채소", "과일", "육류", "수산물", "달걀/유제품", 
    "곡류", "빵/과자", "냉동식품", "조미료/소스", "음료", "기타"
  ];

  const filteredImgs = fridgeImgs.filter((img) => {
    if (imgSort === "전체") return true;
    return imgSort === img.imgSort;
  });

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-[620px] shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh] text-left text-gray-800 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 flex justify-between items-start border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-gray-900">재료로 검색하기</h2>
            <p className="text-[13px] text-gray-500 font-medium mt-1">원하는 재료를 선택하면 해당 재료가 포함된 레시피를 찾아드려요</p>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center cursor-pointer border-none text-gray-400 transition-colors"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          
          {/* Search Input */}
          <div className="relative mb-6">
            <div className="relative w-full bg-gray-50 border border-gray-200 rounded-2xl flex items-center pr-4 pl-11 h-12 transition-all focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
              <div className="absolute left-4 flex items-center justify-center pointer-events-none">
                <SearchIcon sx={{ color: "#9CA3AF", fontSize: 20 }} />
              </div>
              <input
                placeholder="재료 이름을 검색하세요"
                className="w-full h-full bg-transparent text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none border-none font-medium"
                onChange={(e) => setIngreInput(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (ingreInput.trim().length > 0) {
                      toggleIngredientToken(ingreInput.trim());
                      setIngreInput("");
                    }
                  }
                }}
                value={ingreInput}
                type="text"
              />
            </div>

            {/* Autocomplete suggestion */}
            {isInputFocused && recommendList.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-[210] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden py-1.5 max-h-[180px] overflow-y-auto text-[13px] font-bold text-gray-700">
                {recommendList.map((term, index) => (
                  <div 
                    key={index} 
                    onClick={() => { toggleIngredientToken(term); setIngreInput(""); }}
                    className="px-5 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors"
                  >
                    {term}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Tokens Pill List */}
          {modalIngredients.length > 0 && (
            <div className="mb-6">
              <h4 className="text-[11px] font-bold text-gray-400 mb-2.5 uppercase tracking-wider">선택된 재료</h4>
              <div className="flex flex-wrap gap-2">
                {modalIngredients.map((ing, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[12px] font-bold transition-all"
                  >
                    <span>{ing}</span>
                    <ClearIcon 
                      onClick={() => toggleIngredientToken(ing)} 
                      sx={{ fontSize: 14, cursor: "pointer", marginLeft: "2px", opacity: 0.7, '&:hover': { opacity: 1, color: '#ef4444' } }} 
                    />
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Logged-in user fridge items section (Accordion) */}
          {isSignIn && fridgeIngredients.length > 0 && (
            <div className="mb-6 bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all shadow-sm">
              <div 
                className="p-4 flex justify-center items-center gap-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsFridgeExpanded(!isFridgeExpanded)}
              >
                <h4 className="text-[13px] font-extrabold text-gray-800 flex items-center gap-1.5">
                  내 냉장고 속 재료 불러오기
                </h4>
                <KeyboardArrowDownIcon 
                  sx={{ fontSize: 20 }} 
                  className={`text-gray-400 transition-transform duration-300 ${isFridgeExpanded ? 'rotate-180' : ''}`}
                />
              </div>
              
              {isFridgeExpanded && (
                <div className="px-4 pb-5 pt-1 border-t border-gray-100">
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {fridgeIngredients.map((item, i) => {
                      const isSelected = modalIngredients.includes(item);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleIngredientToken(item)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 text-[12px] rounded-xl font-bold cursor-pointer transition-all outline-none ${
                            isSelected
                              ? "bg-white border-2 border-emerald-500 text-emerald-600 shadow-sm"
                              : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {isSelected && <CheckCircleIcon sx={{ fontSize: 16 }} className="text-emerald-500" />}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Category Tabs (Multi-line Wrap) */}
          <div className="mb-5 flex flex-wrap gap-2">
            {sortBtns.map((sort) => (
              <button
                key={sort}
                onClick={() => setImgSort(sort)}
                className={`px-4 py-2 rounded-xl text-[12px] font-bold border cursor-pointer transition-all outline-none ${
                  imgSort === sort
                    ? "bg-gray-800 border-gray-800 text-white shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {sort}
              </button>
            ))}
          </div>

          {/* Image grid cards */}
          {filteredImgs.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {filteredImgs.map((img, index) => {
                const nameLabel = img.name || `재료 ${index + 1}`;
                const isSelected = modalIngredients.includes(nameLabel);

                return (
                  <div
                    key={img.fridgeImgId || index}
                    onClick={() => toggleIngredientToken(nameLabel)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border bg-white aspect-square relative cursor-pointer transition-all hover:shadow-md ${
                      isSelected 
                        ? "border-2 border-emerald-500 bg-emerald-50/20" 
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircleIcon className="absolute right-1.5 top-1.5 text-emerald-500 w-5 h-5 z-10 bg-white rounded-full" />
                    )}
                    <div className="relative w-11 h-11 mb-2">
                      {img.imgUrl ? (
                        <Image
                          src={img.imgUrl}
                          alt={nameLabel}
                          fill
                          sizes="44px"
                          className={`object-contain transition-transform ${isSelected ? 'scale-110' : ''}`}
                        />
                      ) : (
                        <span className="text-2xl flex items-center justify-center h-full">🍳</span>
                      )}
                    </div>
                    <span className={`text-[11px] truncate w-full text-center ${isSelected ? 'font-extrabold text-emerald-700' : 'font-bold text-gray-600'}`}>
                      {nameLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-14 text-center text-[13px] text-gray-400 font-medium flex flex-col items-center gap-3">
              <span className="text-3xl opacity-50">🔍</span>
              해당 분류의 식재료가 존재하지 않습니다.
            </div>
          )}

        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-2.5 bg-gray-50/50">
          <button 
            onClick={handleReset}
            disabled={modalIngredients.length === 0}
            className="w-14 py-3.5 flex items-center justify-center text-gray-500 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            title="초기화"
          >
            <RefreshIcon sx={{ fontSize: 20 }} />
          </button>
          
          <button 
            onClick={onClose}
            className="flex-[0.8] py-3.5 text-[14px] font-bold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer transition-all shadow-sm"
          >
            닫기
          </button>
          
          <button 
            onClick={onSubmit}
            className="flex-[1.5] py-3.5 text-[14px] font-bold text-white bg-darkGreen hover:bg-deepDarkGreen rounded-2xl cursor-pointer transition-all shadow-md flex items-center justify-center border border-transparent outline-none focus:outline-none"
          >
            {modalIngredients.length > 0 ? `${modalIngredients.length}개로 탐색하기` : '탐색하기'}
          </button>
        </div>

      </div>
    </div>
  );
}