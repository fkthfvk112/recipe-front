"use client"
import Swal from "sweetalert2";
import { Box, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import { axiosAuthInstacne } from '@/app/(customAxios)/authAxios';
import { DomainType, Report, ReportType } from './ReportPost';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Checkbox } from '@mui/material';

const style = {
    border:'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    maxWidth:450,
    minWidth:280,
    backgroundColor: 'transparente',
};

export interface EditDelClient{
  editReturnURl:string,
  delPostUrl:string,
  delReturnUrl:string,
  revalidateTagName?:string,
}

interface ReportProp extends Report{
  etcText?:string;
  initialModalOpen?:boolean;
  modalCancelCallback?:(param?:any)=>any;
}
export default function ReportPostClient({domainType, domainId, etcText, initialModalOpen, modalCancelCallback}:ReportProp){
    const [openModal, setOpenModal] = useState<boolean>(initialModalOpen===true?true:false);
    const [nowPageUrl, setNowPageUrl] = useState<string>("");
    const [reportType, setReportType] = useState<ReportType>(ReportType.NO_SELECT);


    useEffect(()=>{
      setNowPageUrl(window.location.href);
    }, [])

    useEffect(()=>{
      if(openModal === false && modalCancelCallback){
        modalCancelCallback();
      }
    }, [openModal])

    const chkReportType = (reportTypeVal:ReportType)=>{
      if(reportType === reportTypeVal){
        setReportType(ReportType.NO_SELECT);
        return;
      }
      setReportType(reportTypeVal);
    }

    const reportDomain = ()=>{
      if(reportType === ReportType.NO_SELECT) return;
      
      let domainIdName:string;
      let fetchPath:string = "";

      switch(domainType){
        case DomainType.Board:
          domainIdName = "boardId";
          fetchPath = "report/board";
          break;
        case DomainType.BoardReview:
          domainIdName = "boardReviewId";
          fetchPath = "report/board-review"
          break;
        case DomainType.Recipe:
          domainIdName = "recipeId";
          fetchPath = "report/recipe";
          break;
        case DomainType.RecipeReview:
          domainIdName = "recipeReviewId";
          fetchPath = "report/recipe-review";
          break;
        default:
          return;
      } 

      if(fetchPath === "") return;

      interface DTO{
        [x:string]: string|number;
        reportType:number;
        reportPageUrl:string;
      }

      const reportDTO:DTO = {
        [domainIdName]:domainId,
        reportType:reportType,
        reportPageUrl:nowPageUrl
      }
    
    axiosAuthInstacne
        .post(`${process.env.NEXT_PUBLIC_API_URL}${fetchPath}`, reportDTO)
        .then(()=>{
          Swal.fire({
            title: "신고 완료",
            text: "신고되었습니다.",
            icon: "success",
          })
        })       
        .finally(()=>{
          setOpenModal(false);
        })
    }

    return (
      <>
        {etcText&&etcText.length>0}
        <div onClick={()=>setOpenModal(!openModal)} className="flex justify-start items-center cursor-pointer">
          <ReportProblemIcon className='hover-pointer m-2'/>
          {etcText&&etcText.length > 0 && <p>{etcText}</p>}
        </div>
        <Modal
        open={openModal}
        onClose={()=>setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
             <Box sx={style}>
                <div className='flex flex-col w-full justify-center bg-white rounded-3xl p-5'>
                    <h2>신고 </h2>
                    <div className="w-full flex items-center justify-start">
                      <Checkbox id="SEXUAL_CONTENT" onClick={()=>{chkReportType(ReportType.SEXUAL_CONTENT)}} className='mr-0' color="success" checked={reportType===ReportType.SEXUAL_CONTENT}/>
                      <label htmlFor="SEXUAL_CONTENT">성적인 콘텐츠</label>
                    </div>
                    <div className="w-full flex items-center justify-start">
                      <Checkbox id="VIOLENCE_HATE" onClick={()=>{chkReportType(ReportType.VIOLENCE_HATE)}} className='mr-0' color="success" checked={reportType===ReportType.VIOLENCE_HATE}/>
                      <label htmlFor="VIOLENCE_HATE">폭력, 혐오 콘텐츠</label>
                    </div>
                    <div className="w-full flex items-center justify-start">
                      <Checkbox id="FALSE_INFORMATION" onClick={()=>{chkReportType(ReportType.FALSE_INFORMATION)}} className='mr-0' color="success" checked={reportType===ReportType.FALSE_INFORMATION}/>
                      <label htmlFor="FALSE_INFORMATION">거짓 정보가 포함</label>
                    </div>
                    <div className="w-full flex items-center justify-start">
                      <Checkbox id="SPAM_ADS" onClick={()=>{chkReportType(ReportType.SPAM_ADS)}} className='mr-0' color="success" checked={reportType===ReportType.SPAM_ADS}/>
                      <label htmlFor="SPAM_ADS">스팸, 광고 등 혼란을 야기</label>
                    </div>
                    <div className="w-full flex items-center justify-start">
                      <Checkbox id="OTHER" onClick={()=>{chkReportType(ReportType.OTHER)}} className='mr-0' color="success" checked={reportType===ReportType.OTHER}/>
                      <label htmlFor="OTHER">기타</label>
                    </div>
                </div>
                <div className='flex w-full justify-center mt-2 bg-red-500 rounded-3xl'>
                    <button onClick={()=>reportDomain()} className='w-full border-none text-white font-bold'>신고하기</button>
                </div>
                <div className='flex w-full justify-center mt-2 bg-white rounded-3xl'>
                    <button onClick={()=>setOpenModal(false)} className='w-full border-none'>취소</button>
                </div>
            </Box>
        </Modal>
      </>
    )
}