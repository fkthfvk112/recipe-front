import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios"
import Swal from "sweetalert2"

export default function IngreItem({ingreName, refetch}:{ingreName:string, refetch:()=>any}){
    const saveIngre = ()=>{
        axiosAuthInstacne.post(`admin/ingre/save/${ingreName}`)
            .then((res)=>{
                refetch();
                Swal.fire({
                    title: "저장이 완료되었습니다!",
                    icon: "success",
                  })
            })
    }

    return(
        <span className="flex justify-center items-center rounded-lg p-2 m-2 border border-[#e1e1e1] ">
            <h2>
                {ingreName}
            </h2>
            <button onClick={saveIngre} className="ms-3 saveBtn rounded-full w-10 h-10 flex justify-center items-center text-xl">+</button>
        </span>
    )
}