import Link from "next/link";

export default function NoContent_Recipe(){
    return (
        <div>
            <div className="text-2xl font-bold mb-10">
                일치하는 검색 결과가 없습니다.
            </div>
            <div>
                <span> 이런 항목은 어떠세요?</span>
                <div className="mt-12">
                    <Link href="/recipes/1/sortingCondition=POPULARITY" className="saveBtn-outline-green me-2 p-2 ps-3 pe-3">인기 레시피</Link>
                    <Link href="/recipes/1/sortingCondition=LATEST" className="saveBtn-outline-green ms-2 p-2 ps-3 pe-3">최근 레시피</Link>
                </div>
            </div>
        </div>
    )
}