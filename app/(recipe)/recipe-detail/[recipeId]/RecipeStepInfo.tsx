import Image from "next/image";
import { CookingSteps_show } from "../../types/recipeType";
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';

export default function RecipeStepInfo({
  steps,
}: {
  steps: CookingSteps_show[];
}) {

  const stepItems = steps.map((step, inx) => {
    return (
      <div key={inx} className="mt-6 mb-3">
        <div className="flex justify-between font-bold border-gray-200 mb-1">
          <span>Step {step.order}</span>
          <span><AccessAlarmsIcon/> {step.time}분</span>
        </div>
        <div className="bottom-line-noM mb-3 w-full"/>

        <div className="grid grid-cols-3 ">
          <div className={`${step.photo?'col-span-2':'col-span-3'} p-3 break-words break-keep whitespace-pre-wrap`}>{step.description}</div>
          {step.photo &&
            <div className="img-wrapper-square aspect-square w-full pb-[100%]">
              <Image className="inner-img" src={step.photo} fill alt="noimg" />
            </div>
          }
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
