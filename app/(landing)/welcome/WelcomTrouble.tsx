interface AboutPageProps {
  problemTitle: string;
  problemTexts: string[];
  solutionTitle:string;
  solutionTexts: string[];
  valueTitle:string;
  value: string[];
  problemImg?: string;
  solutionImg?: string;
}

export default function WelcomTrouble({
  problemTitle,
  problemTexts,
  solutionTitle,
  solutionTexts,
  valueTitle,
  value,
  problemImg = "/images/problem.png",
  solutionImg = "/images/solution.png",
}: AboutPageProps) {
  return (
    <main className="w-full flex flex-col items-center px-6 py-12 space-y-16 bg-gray-50 pt-32 pb-32">
      {/* 1. 문제 제기 */}
      <section className="max-w-4xl flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-3">{problemTitle}</h3>
          {
            problemTexts.map((text, inx)=><p key={inx} className="text-gray-600 leading-relaxed mb-3">{text}</p>)
          }
        </div>
        <div className="flex-1">
          <img
            src={problemImg}
            alt="문제 이미지"
          />
        </div>
      </section>
      {/* 2. 해결 */}
      <section className="max-w-4xl flex flex-col md:flex-row-reverse items-center gap-8 pt-36">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-3">{solutionTitle}</h3>
          {
            solutionTexts.map((text, inx)=><p key={inx} className="text-gray-600 leading-relaxed mb-3">{text}</p>)
          }
        </div>
        <div className="flex-1">
          <img
            src={solutionImg}
            alt="해결 이미지"
          />
        </div>
      </section>
      <section className="max-w-3xl text-center pt-16">
        <h3 className="text-2xl font-semibold mb-3">{valueTitle}</h3>
        <ul className="space-y-2 text-gray-600 text-left">
          {value.map((item, idx) => (
            <li key={idx}>✅ {item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
