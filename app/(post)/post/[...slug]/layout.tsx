import React from "react";

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return <main className={`defaultOuterContainer flex pb-20 bg-[#BFD8C5]`}>{children}</main>;
}
