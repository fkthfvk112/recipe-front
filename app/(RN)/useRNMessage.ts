import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RNMessageInterface } from "./messageInterface";
import { fridgeModalOpenState } from "../(recoil)/fridgeAtom";
import { useRecoilState } from "recoil";
import { addtionalBtnOpenState } from "../(recoil)/etcAtom";

export default function useRNMessage() {
    const [modalOpen, setModalOpen] = useRecoilState<boolean>(fridgeModalOpenState);
    const [plusBtnClicked, setPlusBtnClicked] = useRecoilState<boolean>(addtionalBtnOpenState);
    
    const router = useRouter();
    const listener = (evt:MessageEvent)=>{    
      try{
        const rnMessage:RNMessageInterface = JSON.parse(evt.data);

        switch(rnMessage.type){
          case "BACK_PRESS" :{
            if (typeof window !== "undefined" && window.ReactNativeWebView) {
              if(modalOpen){
                setModalOpen(false);
                return;
              }

              if(plusBtnClicked){
                setPlusBtnClicked(false);
                return;
              }

              if (window.history.length > 1) {
                router.back();
              }else{
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({ type: "LAST_PAGE" })
                );
              }
            }
            break;
          }
          default:{
            console.warn("Unknown RN message type:", rnMessage.type);
          }
        }
      }catch (err) {
        console.error("Invalid RN message received:", evt.data);
      } 
    }

  useEffect(() => {
    // 안드로이드 대응
    document.addEventListener("message", listener as any);
    // iOS 대응
    window.addEventListener("message", listener as any);

    return () => {
      document.removeEventListener("message", listener as any);
      window.removeEventListener("message", listener as any);
    };
  }, [router, modalOpen, plusBtnClicked]);
}