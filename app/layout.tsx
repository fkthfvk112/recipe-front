import IntervalConfig from "./(interval)/intervalConfig";
import "./globals.css";
import MainContainer from "./MainContainer";

export const metadata = {
  icons: {
    icon: "/common/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en">
      <body>
        <MainContainer>
          <IntervalConfig/>
          {children}
        </MainContainer>
      </body>
    </html>
  );
}
