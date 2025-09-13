interface FeatureItem {
  title: string;
  description: string;
  iconUrl: string;
}

interface FeatureSectionProps {
  features: FeatureItem[];
  heading?: string;
  subheading?: string;
}

export default function FeatureSection({
  features,
  heading = "Our Service Features",
  subheading = "서비스가 제공하는 주요 기능들을 소개합니다.",
}: FeatureSectionProps) {
  return (
    <section className="w-full py-16 px-6 bg-white mt-16 mb-16">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-xl font-bold mb-4">{heading}</h2>
        <p className="text-gray-600">{subheading}</p>
      </div>

        <div
          className="
            grid gap-3
            grid-cols-3
            [@media(max-width:600px)]:grid-cols-2
            [@media(max-width:300px)]:grid-cols-1
          "
        >   
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-gray-50 flex flex-col justify-center items-center transition aspect-square rounded-xl"
          >
            <div className="flex justify-center mb-4">
              <img
                src={feature.iconUrl}
                alt={feature.title}
                className="w-12 h-12"
              />
            </div>
            <h3 className="text-xl mb-2 text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed text-center">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
