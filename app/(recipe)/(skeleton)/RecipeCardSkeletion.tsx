

export default function RecipeCardSkeletion() {
  return (
    <div className="flex flex-col overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm w-full aspect-square min-w-[140px] mb-4 animate-pulse">
      {/* Thumbnail Area */}
      <div className="w-full h-[55%] bg-gray-200 border-b border-gray-100" />

      {/* Content Area */}
      <div className="flex flex-col justify-between h-[45%] p-3">
        <div>
          {/* Title & Star Rating */}
          <div className="flex justify-between items-center w-full gap-2 mb-2">
            <div className="h-4 bg-gray-200 rounded-full w-2/3" />
            <div className="h-3.5 bg-gray-200 rounded-full w-8" />
          </div>

          {/* Description */}
          <div className="h-3 bg-gray-200 rounded-full w-5/6 mb-1.5" />
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-gray-100 flex justify-between items-center mt-auto">
          <div className="flex gap-2">
            <div className="h-3.5 bg-gray-200 rounded-full w-8" />
            <div className="h-3.5 bg-gray-200 rounded-full w-8" />
          </div>
          <div className="h-3 bg-gray-200 rounded-full w-12" />
        </div>
      </div>
    </div>
  );
}