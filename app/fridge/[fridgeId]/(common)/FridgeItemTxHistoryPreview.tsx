"use client";

export default function FridgeItemTxHistoryPreview({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  if (count === 0) return null;

  return (
    <div
      onClick={onClick}
      className="w-full mt-6 border rounded-xl p-3 cursor-pointer hover:bg-gray-50"
    >
      <div className="flex justify-between items-center">
        <div className="font-semibold">관리 내역</div>
        <span className="text-sm text-gray-500">
          {count}개 &gt;
        </span>
      </div>
    </div>
  );
}
