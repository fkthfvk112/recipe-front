import Image from "next/image";

type Props = {
  name: string;
  presetSort: string;
  description?: string;
  items: {
    sortOrder: number;
    ingreName?: string;
    fridgeImgId?: number;
    fridgeImgUrl?: string;
  }[];
};

export default function PresetPreviewCard({
  name,
  presetSort,
  description,
  items,
}: Props) {
  return (
    <div className="border border-[#ddd] rounded-xl p-4 bg-[#fafafa] mb-6">
      <h3 className="font-bold text-lg mb-2">📦 등록될 프리셋 미리보기</h3>

      <div className="text-sm mb-2">
        <b>이름:</b> {name || "미입력"}
      </div>
      <div className="text-sm mb-2">
        <b>종류:</b> {presetSort || "미입력"}
      </div>
      {description && (
        <div className="text-sm mb-3">
          <b>설명:</b> {description}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {items.map((item) => (
          <div
            key={item.sortOrder}
            className="border rounded-md p-2 bg-white flex gap-2 items-center"
          >
            {item.fridgeImgUrl && (
              <Image
                src={item.fridgeImgUrl}
                width={40}
                height={40}
                alt="img"
                className="rounded"
              />
            )}
            <div className="text-sm">
              <div className="font-medium">
                {item.sortOrder}. {item.ingreName ?? "미선택"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
