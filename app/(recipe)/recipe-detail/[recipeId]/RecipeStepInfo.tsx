import Image from "next/image";
import { CookingSteps_show } from "../../types/recipeType";

export default function RecipeStepInfo({
  steps,
}: {
  steps: CookingSteps_show[];
}) {
  const skeltonImg = <div style={{ width: "100px", height: "100px" }}></div>;

  const stepItems = steps.map((step, inx) => {
    return (
      <div key={inx} className="mt-3 mb-3">
        <div className="font-bold border-b-2 border-gray-200 mb-3">
          Step {step.order}
        </div>
        <div className="flex justify-between">
          {step.photo ? (
            <Image src={step.photo} width={200} height={200} alt="noimg" />
          ) : (
            skeltonImg
          )}

          <div className="w-36">{step.description}</div>
        </div>
      </div>
    );
  });

  return (
    <div className="w-full mt-6">
      <h2 className="border-b-2  border-yellow-900 m-2 mt-6 mb-6">요리 순서</h2>
      {stepItems}
    </div>
  );
}
