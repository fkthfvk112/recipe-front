"use client";
import axios from "axios";
import Swal from "sweetalert2";


/** 기본 서버로 요청하는 axios */
export const defaultAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
});


defaultAxios.interceptors.response.use((res)=>{
  return res;
}, (err)=>{

  //have to :: swal 적용 여부 리체크
  return Promise.reject(err);
})

//-------------------------------------------------------------------------------------------------------------------------------

/** 로그인시 요청하는 axios*/
export const axiosAuthInstacne = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
});


axiosAuthInstacne.interceptors.response.use((res) => {
  return res;
},
(err)=>{
  if(err.response.data === "T001"){
    console.log("Access cookie expired set new cookie success");
    const originBaseUrl = err?.config?.baseURL;
    const originUrl = err?.config?.url;
    const originMethod = err?.config?.method;
    const originData = err?.config?.data;

    if (originUrl === undefined || originMethod === undefined) {
      return Promise.reject("오리진 url 혹은 오리진 method가 undefined");
    }

    return axios({
      method: originMethod,
      baseURL: originBaseUrl,
      url: originUrl,
      data: originData,
      withCredentials: true,
      headers: {
        "Content-Type": err.response.headers["content-type"],
      },
    });
  }
  return Promise.reject(err);
}
);



//----------------------------------- 공통 에러 적용 ----------------------------
[defaultAxios, axiosAuthInstacne].map((instance)=>{
  instance.interceptors.response.use((res)=>{
    return res;
  },
  (err)=>{
    if (err.message === "Network Error" || err.code === 'ERR_INTERNET_DISCONNECTED') {
      Swal.fire({
      title: "인터넷 연결 실패",
      text: "인터넷을 다시 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
      confirmButtonColor: '#d33',
      allowEnterKey:false
      });
      
      return Promise.reject(err);
    }

    return Promise.reject(err);
  })
})