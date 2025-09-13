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
    <section className="w-full bg-gradient-to-r from-green-600 to-green-300 text-white py-16 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl mb-6">{message}</h2>
        <button
          onClick={onCtaClick}
          className="px-8 py-3 w-[200px] bg-white font-semibold rounded-lg border-none text-gray-600 hover:bg-gray-100 transition"
        >
          {ctaText}
        </button>
      </div>
    </section>
  );
}
