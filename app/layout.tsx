import { Metadata } from "next";
import IntervalConfig from "./(interval)/intervalConfig";
import "./globals.css";
import MainContainer from "./MainContainer";
import NextTopLoader from 'nextjs-toploader';
import Script from "next/script";
import RNDefaultEmptyComp from "./(RN)/RNDefaultEmptyComp";

import RegisterSW from "./RegisterSW";
import PWAInstallBanner from "./PWAInstallBanner";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mug-in.com";
  return {
    metadataBase: new URL(baseUrl),
    title: "머그인 - 레시피 & 스마트 냉장고",
    description: "재료를 공유하고 관리하고 소비해요. 낭비없는 삶 머그인",
    manifest: "/manifest.json",
    themeColor: "#10b981",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/common/favicon.png", type: "image/png", sizes: "192x192" },
      ],
      shortcut: "/common/favicon.png",
      apple: "/common/favicon.png",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: "머그인 - 레시피 & 스마트 냉장고",
      description: "재료를 공유하고 관리하고 소비해요. 낭비없는 삶 머그인",
      url: baseUrl,
      siteName: "머그인",
      images: [
        {
          url: `${baseUrl}/common/favicon.png`,
          width: 512,
          height: 512,
          alt: "머그인 로고",
        },
      ],
    },
  };
}
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/common/favicon.png" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-4679279476061490"/>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4679279476061490"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google AdSense End*/}

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M5T52V8F');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body>
        <RegisterSW />
        <PWAInstallBanner />
        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M5T52V8F"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        {/* End Google Tag Manager (noscript) */}
      <Script
          src='https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js'
          strategy='beforeInteractive'
        />
      <NextTopLoader color="#FB8500" showSpinner={false} zIndex={50000}/>
        <MainContainer>
          {/* <IntervalConfig/> */}
          {children}
        </MainContainer>
      </body>
    </html>
  );
}
