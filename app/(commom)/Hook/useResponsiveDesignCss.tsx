import { useEffect, useState } from "react";

const useResponsiveDesignCss = (): {navCss:string, layoutPadding:string,layoutMargin:string, layoutBottomMargin:string}=>{
    const [navCss, setNavCss] = useState<string>("hidden");
    const [layoutPadding, setLayoutPadding] = useState<string>("pt-20")
    const [layoutMargin, setLayoutMargin]   = useState<string>("mt-20");
    const [layoutBottomMargin, setLayoutBottomMargin]   = useState<string>("");


    useEffect(()=>{
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if(!isMobile){
          setNavCss("w-full h-20 bg-white fixed top-0 z-50 shadow-md")
          setLayoutPadding("pt-20");
          setLayoutMargin("mt-20");
          setLayoutBottomMargin("")
        }else{
          setNavCss("w-full h-20 bg-white fixed bottom-0 z-50 shadow-md")
          setLayoutPadding("pb-20");
          setLayoutMargin("mb-20");
          setLayoutBottomMargin("mb-20")
        }
      }, []);

    return {navCss, layoutPadding, layoutMargin, layoutBottomMargin};
}

export default useResponsiveDesignCss;
