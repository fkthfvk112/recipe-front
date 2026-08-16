import React from "react";

function TitleDescription({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="w-full max-w-full my-3 sm:my-5 text-left box-border">
      <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
        {title}
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 leading-relaxed break-keep">
        {desc}
      </p>
    </div>
  );
}

export default React.memo(TitleDescription);