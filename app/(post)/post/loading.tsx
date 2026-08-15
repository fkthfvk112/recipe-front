export default function PostLoadingSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20 animate-pulse">
      {/* 히어로 헤더 스켈레톤 */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
          <div className="flex flex-col gap-3">
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
            <div className="h-9 w-64 bg-gray-200 rounded-xl mt-1" />
            <div className="h-4 w-80 bg-gray-100 rounded-lg" />
            <div className="flex gap-2 pt-3">
              <div className="h-6 w-14 bg-gray-200 rounded-lg" />
              <div className="h-6 w-14 bg-gray-200 rounded-lg" />
              <div className="h-6 w-14 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* 3x3 그리드 카드 스켈레톤 */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-100 p-5 flex flex-col gap-3">
              <div className="w-full aspect-[16/9] bg-gray-200 rounded-xl" />
              <div className="h-5 w-3/4 bg-gray-200 rounded-lg" />
              <div className="h-4 w-full bg-gray-100 rounded-md" />
              <div className="h-4 w-2/3 bg-gray-100 rounded-md" />
              <div className="h-3 w-20 bg-gray-200 rounded-md mt-auto pt-2" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
