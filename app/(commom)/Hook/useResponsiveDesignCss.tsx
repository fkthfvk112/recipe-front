const useResponsiveDesignCss = (): { navCss: string, layoutPadding: string, layoutMargin: string, layoutBottomMargin: string, layoutTop: string } => {
  return {
    // 모바일: bottom-0 고정 / 데스크탑(md): top-0 고정
    navCss: "w-full h-[70px] bg-white fixed z-50 shadow-md bottom-0 md:bottom-auto md:top-0",
    
    // 모바일: 하단 여백 / 데스크탑(md): 상단 여백
    layoutPadding: "pb-[70px] md:pb-0 md:pt-[70px]",
    layoutMargin: "mb-[70px] md:mb-0 md:mt-[70px]",
    layoutBottomMargin: "mb-[70px] md:mb-0",
    layoutTop: "top-0 md:top-[70px]",
  };
}

export default useResponsiveDesignCss;