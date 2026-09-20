"use client";
import axios from "axios";
import Swal from "sweetalert2";
import { deleteAuthToken } from "../(user)/signin/utils/authUtil";
import { errorCode } from "../(commom)/Error/ErrorCode";


/** 기본 서버로 요청하는 axios */
export const defaultAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "https://localhost:8080/"}`,
  withCredentials: true,
  timeout: 30000,
});

defaultAxios.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    //have to :: swal 적용 여부 리체크
    return Promise.reject(err);
  }
);

//-------------------------------------------------------------------------------------------------------------------------------

/** 로그인시 요청하는 axios*/
export const axiosAuthInstacne = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "https://localhost:8080/"}`,
  withCredentials: true,
  timeout: 30000,
});

// 동적 BaseURL 설정 (브라우저 접속 호스트가 localhost나 공유기 IP일 때 포트 8080 자동 매핑)
[defaultAxios, axiosAuthInstacne].forEach((instance) => {
  instance.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (
        host === "localhost" ||
        host === "127.0.0.1" ||
        host.startsWith("192.168.") ||
        host.startsWith("10.")
      ) {
        config.baseURL = `https://${host}:8080/`;
      }
    }
    return config;
  });
});

axiosAuthInstacne.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (!err?.response) {
      return Promise.reject(err);
    }

    if (err.response.data === "T001" || err.response.data?.code === "T001") {
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
          "Content-Type": err.response.headers?.["content-type"],
        },
      });
    }
    return Promise.reject(err);
  }
);

//----------------------------------- 공통 에러 적용 ----------------------------
[defaultAxios, axiosAuthInstacne].forEach((instance) => {
  instance.interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      // 1. 네트워크/타임아웃 등 HTTP 응답 객체가 없는 경우
      if (!err?.response) {
        if (err?.message === "Network Error" || err?.code === "ERR_INTERNET_DISCONNECTED") {
          Swal.fire({
            title: "인터넷 연결 실패",
            text: "서버에 연결할 수 없습니다. 백엔드 서버 상태 및 SSL 인증서 허용 여부를 확인해주세요.",
            icon: "warning",
            confirmButtonText: "확인",
            confirmButtonColor: "#d33",
            allowEnterKey: false,
          });
        } else if (err?.code === "ECONNABORTED" || err?.message?.includes("timeout")) {
          Swal.fire({
            title: "서버 응답 시간이 초과되었습니다.",
            text: "잠시 후 다시 시도해 주세요.",
            icon: "warning",
            confirmButtonText: "확인",
            confirmButtonColor: "#d33",
            allowEnterKey: false,
          });
        }
        return Promise.reject(err);
      }

      // 2. HTTP 응답이 있는 경우
      const resData = err.response.data;
      const resCode = typeof resData === "string" ? resData : resData?.code;

      if (
        resCode === "T002" ||
        resCode === "T003" ||
        resCode === "T004" ||
        resCode === "T005"
      ) {
        deleteAuthToken();
      } else if (resData?.code && errorCode.includes(resData.code)) {
        if (resData.code === "M003") {
          deleteAuthToken();
        }

        Swal.fire({
          title: "에러가 발생하였습니다.",
          text: resData.message,
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: "#d33",
          allowEnterKey: false,
        });
      } else if (err.response.status === 403 && resCode !== "T001") {
        console.log("에러", err);
        Swal.fire({
          title: "에러가 발생하였습니다.",
          text: "사용 권한이 없습니다.",
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: "#d33",
          allowEnterKey: false,
        });
      } else if (resCode !== "T001") {
        Swal.fire({
          title: "에러가 발생하였습니다.",
          text: resData?.message || (typeof resData === "string" ? resData : undefined),
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: "#d33",
          allowEnterKey: false,
        });
      }
      return Promise.reject(err);
    }
  );
});