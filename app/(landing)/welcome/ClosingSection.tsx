interface ClosingSectionProps {
  message: string;
  ctaText: string;
  onCtaClick?: () => void;
}

export default function ClosingSection({
  message,
  ctaText,
  onCtaClick,
}: ClosingSectionProps) {
  return (
    <section className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white py-16 px-6 text-center rounded-3xl shadow-sm my-6">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
          {message}
        </h2>
        <button
          type="button"
          onClick={onCtaClick}
          className="px-8 py-3.5 min-w-[200px] bg-white font-extrabold rounded-2xl border-none text-emerald-700 hover:bg-emerald-50 transition-all shadow-md active:scale-[0.99] cursor-pointer outline-none"
        >
          {ctaText}
        </button>
      </div>
    </section>
  );
}