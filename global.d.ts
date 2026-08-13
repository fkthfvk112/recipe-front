declare global {
    interface Window {
      naver: any;
      ReactNativeWebView?: {
        postMessage: (message: string) => void;
      };
      gtag: (command: string, action: string, params?: any) => void;
    }
  }
  export {};