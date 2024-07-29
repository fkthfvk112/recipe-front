import { useEffect, useState } from "react";

const useResponsiveDesignCss = (): {navCss:string, layoutPadding:string}=>{
    const [navCss, setNavCss] = useState<string>("w-full h-20 bg-white fixed top-0 z-50");
    const [layoutPadding, setLayoutPadding] = useState<string>("pt-20")

    useEffect(()=>{
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if(!isMobile){
          setNavCss("w-full h-20 bg-white fixed top-0 z-50 shadow-md")
          setLayoutPadding("pt-20");
        }else{
          setNavCss("w-full h-20 bg-white fixed bottom-0 z-50 shadow-md")
          setLayoutPadding("pb-20");
        }
      }, []);

    return {navCss, layoutPadding};
}

export default useResponsiveDesignCss;
