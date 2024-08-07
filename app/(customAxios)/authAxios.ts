"use client";
import { rejects } from "assert";
import axios, { AxiosResponse } from "axios";
import { error } from "console";

// axios.defaults.withCredentials = true;

// axios.defaults.headers["Access-Control-Allow-Origin"] =
//   "https://localhost:8080";
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
