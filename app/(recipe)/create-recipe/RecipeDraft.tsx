import { Dispatch, SetStateAction, useState } from "react"
import { CookingSteps_create, RecipeDraftInterface } from "../types/recipeType";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Modal } from "@mui/material";
import { extractDateTime } from "@/app/(utils)/DateUtil";
import { RecipeCreate } from "./page";
import Swal from "sweetalert2";
import DeleteIcon from '@mui/icons-material/Delete';
import { useRecoilState } from "recoil";
import { recipeStepInitialState } from "@/app/(recoil)/recipeAtom";

interface RecipeDraftModalInterface{
  recipe:RecipeCreate,
  setRecipe:Dispatch<SetStateAction<RecipeCreate>>
  draftId:number,
  setDraftId:Dispatch<SetStateAction<number>>
}

// 레시피 임시저장
export default function RecipeDraft({recipe, setRecipe, draftId, setDraftId}:RecipeDraftModalInterface){
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [resetStep, setResetStep] = useRecoilState<number>(recipeStepInitialState);

    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<RecipeDraftInterface[]>({
        queryKey: ['draftRecipe'],
        queryFn: (): Promise<RecipeDraftInterface[]> =>  axiosAuthInstacne.get<RecipeDraftInterface[]>('/recipe/draft').then((res)=>res.data??[]),
        staleTime: 1000 * 60 * 5, // 5분간 fresh
        gcTime: 1000 * 60 * 30,
    });

    const fetchDraftData = (recipeId:number)=>{
      if(!recipeId) return;
        Swal.fire({
            title: "임시저장 불러오기",
            text:"임시저장을 불러오면 작성중이던 내용이 사라집니다. 데이터를 불러오시겠습니까?",
            icon: "info",
            showCancelButton:true,
            cancelButtonText:"취소",
            confirmButtonText: "확인",
            allowOutsideClick:false,
        }).then((result) => {
            if(result.isConfirmed){
              axiosAuthInstacne.get(`recipe/draft/detail?recipeId=${recipeId}`)
                .then((res)=>{
                  const resData:RecipeCreate = res.data.recipeDTO

                  setRecipe(resData);
                  setDraftId(res.data.recipeDTO.recipeId)
                  setOpenModal(false)

                  //step dnd 초기화를 위함
                  setResetStep(prev=>prev+1);

                  Swal.fire({
                    toast: true,
                    position: 'center',
                    icon: 'success',
                    title: '불러오기 완료',
                    showConfirmButton: false,
                    timer: 2000,
                  })
                })   
            }
        })
    }

    const deleteDraft = (recipeId: number) => {
      Swal.fire({
        title: "임시 저장 데이터를 삭제하시겠습니까?",
        text: "삭제하면 되돌릴 수 없어요. 정말 삭제하시겠어요?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
        confirmButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosAuthInstacne
            .delete(`recipe/del?recipeId=${recipeId}`)
            .then((res) => {
              Swal.fire({
                title: "삭제 완료",
                icon: "success",
              }).then(() => {
                // 임시저장 리스트 초기화
                queryClient.invalidateQueries({ queryKey: ["draftRecipe"] });
              });
            })
        }
      });
    };
    

    const draftComp = data?.map((ele)=>{
      return (
        <div key={ele.recipeId} onClick={()=>fetchDraftData(ele.recipeId)}
          className="w-full flex justify-between bottom-line-thin p-3 hover-pointer hover:bg-[#e1e1e1]">
          <div>
            <p>{ele.recipeName}</p>
            <p className="text-sm text-[#a1a1a1]">
                {extractDateTime(ele.draftedAt)}
            </p>
          </div>
          <div onClick={(e)=>{e.stopPropagation();deleteDraft(ele.recipeId)}}  className='mt-0.5 mb-0.5 cursor-pointer'>
              <DeleteIcon sx={{fill:"#a1a1a1"}} className='hover-pointer m-2'/>
          </div>
        </div>
      )
    })


    /** 임시 저장 */
    const saveDraftRecipe = ()=>{
      if(recipe.recipeName.length < 1){
        Swal.fire({
          toast: true,
          position: 'center',
          icon: 'warning',
          title: '제목을 입력해주세요.',
          showConfirmButton: false,
          timer: 2000,
        })
        return;
      }

      axiosAuthInstacne
      .post("recipe/draft", {...recipe, isDraft:true, recipeId:draftId})
      .then((res) => {
        if (res.status === 200) {
          setDraftId(res.data);

          //임시저장 리스트 초기화
          queryClient.invalidateQueries({ queryKey: ['draftRecipe'] });
          Swal.fire({
            toast: true,
            position: 'center',
            icon: 'success',
            title: '임시저장 완료',
            showConfirmButton: false,
            timer: 2000,
          })
        }
      })  
    }
    

    return(
        <>
        <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="bottom-line">
            <h1 className="text-2xl">임시저장 글</h1>
            <div className="text-[#121212] mt-3">총  {data?.length}개</div>
          </div>
          <div className="w-full h-[400px] overflow-y-scroll">
            {draftComp}
          </div>
          <div className="w-full text-center mt-6">
            <button className="cancelBtn me-2" onClick={() => setOpenModal(false)}>
              닫기
            </button>
          </div>
        </Box>
      </Modal>
      <button className="border-1 border-[#e1e1e1] rounded-[15em] text-[#727272] bg-white font-bold flex overflow-hidden w-[100px] p-1">
        <span
          onClick={() => saveDraftRecipe()}
          className="flex-1 text-center cursor-pointer text-sm"
        >
          저장
        </span>
        <span className="w-[1px] bg-gray-300" />
        <span
          onClick={() => setOpenModal(true)}
          className="flex-1 text-center cursor-pointer text-[#8ac926] text-sm"
        >
          {data?.length}
        </span>
      </button>
        </>
    )
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth:600,
  width: "90%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};