import Link from "next/link";
import Button from "@/app/(commom)/Component/Button";

export default function NoContent_Recipe(){
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 w-full max-w-md mx-auto">
            <div className="text-xl font-extrabold text-gray-800 mb-3">
                일치하는 검색 결과가 없습니다.
            </div>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                검색어나 필터 조건을 변경해 보시거나,<br />아래의 추천 테마를 확인해 보세요.
            </p>
            <div className="w-full">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-4">추천 레시피 탐색</span>
                <div className="flex gap-4 justify-center w-full">
                    <Link href="/recipes/1/sortingCondition=POPULARITY" className="flex-1 max-w-[140px]">
                        <Button type="button" variant="outline-primary" size="sm" className="w-full py-2.5">인기 레시피</Button>
                    </Link>
                    <Link href="/recipes/1/sortingCondition=LATEST" className="flex-1 max-w-[140px]">
                        <Button type="button" variant="outline-secondary" size="sm" className="w-full py-2.5">최근 레시피</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}