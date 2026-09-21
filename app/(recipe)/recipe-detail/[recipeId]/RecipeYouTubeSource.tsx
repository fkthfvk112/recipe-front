"use client";

import { RecipeAiSource } from "@/app/(recipe)/types/recipeType";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface RecipeYouTubeSourceProps {
  aiSource?: RecipeAiSource;
}

export default function RecipeYouTubeSource({ aiSource }: RecipeYouTubeSourceProps) {
  if (!aiSource || !aiSource.sourceVideoId) {
    return null;
  }

  return (
    <section className="w-full mt-6 pt-6 border-t border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <SmartDisplayIcon sx={{ fontSize: 20 }} />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 tracking-tight flex items-center gap-1.5">
              영상으로 조리법 함께 보기
            </h3>
            <p className="text-xs text-gray-400 font-medium">
              출처: {aiSource.channelName || "유튜브 요리 채널"}
            </p>
          </div>
        </div>

        {aiSource.sourceUrl && (
          <a
            href={aiSource.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 no-underline"
          >
            원본 영상 <OpenInNewIcon sx={{ fontSize: 13 }} />
          </a>
        )}
      </div>

      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xs border border-gray-200 bg-black">
        <iframe
          className="w-full h-full border-0"
          src={`https://www.youtube.com/embed/${aiSource.sourceVideoId}`}
          title={aiSource.originalTitle || "YouTube Recipe Video"}
          allow="accelerometer; autoplay; clipboard-write-encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </section>
  );
}
