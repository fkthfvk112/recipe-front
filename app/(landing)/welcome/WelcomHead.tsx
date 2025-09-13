"use client"

interface WelcomeHeadInterface {
  title: string;
  description: string;
  imgUrl: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export default function WelcomeHead({
  title,
  description,
  imgUrl,
  ctaText = "시작하기",
  onCtaClick,
}: WelcomeHeadInterface) {
  return (
    <section className="flex flex-col md:flex-row w-full p-12 items-center bg-gray-50 pb-20 pt-36 relative">
      {/* 왼쪽 텍스트 영역 */}
      <div className="flex-1 md:pr-8 text-center md:text-left">
        <h1 className="text-2xl font-bold mb-4 whitespace-pre-line">{title}</h1>
        <p className="text-gray-700 mb-6 whitespace-pre-line">{description}</p>
        <button
          onClick={onCtaClick}
          className="hidden md:inline-block w-64 mt-16 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          {ctaText}
        </button>
      </div>
      {/* 오른쪽 이미지 영역 */}
      <div className="flex-1 flex justify-center mt-6 md:mt-0">
        <img
          src={imgUrl}
          alt={title}
          className="w-64 h-64 object-cover"
        />
          <button
            onClick={onCtaClick}
            className="md:hidden absolute bottom-10 left-1/2 -translate-x-1/2 w-64 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            {ctaText}
          </button>
      </div>
    </section>
  );
}
