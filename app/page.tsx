import { cookies } from "next/headers";

export default function Home() {
  console.log(cookies().get("test"));

  return (
    <div className="bg-[#ca8a04]">
      홈<button>버튼</button>
    </div>
  );
}
