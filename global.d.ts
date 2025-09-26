declare global {
    interface Window {
      naver: any;
      ReactNativeWebView?: {
        postMessage: (message: string) => void;
      };
    }
  }
  
  export {};