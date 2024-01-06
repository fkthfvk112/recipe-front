"use client";
import { rejects } from "assert";
import axios, { AxiosResponse } from "axios";

export const axiosAuthInstacne = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
});

axiosAuthInstacne.interceptors.response.use((res) => {
  if (res.data === "Issue new token success") {
    console.log("Access cookie expired set new cookie success");
    const originBaseUrl = res?.config?.baseURL;
    const originUrl = res?.config?.url;
    const originMethod = res?.config?.method;
    const originData = res?.config?.data;
    if (originUrl === undefined || originMethod === undefined) {
      return Promise.reject("오리진 url 혹은 오리진 method가 undefined");
    }
    console.log("url", originBaseUrl);
    console.log("url", originUrl);
    console.log("method", originMethod);
    console.log("data", originData);

    return resendOriginMethod(
      originBaseUrl + originUrl,
      originMethod,
      originData
    );
  }
  return res;
});

const resendOriginMethod = (
  originUrl: string,
  originMethod: string,
  originData: object
): Promise<AxiosResponse<any, any>> =>
  axios({
    method: originMethod,
    url: originUrl,
    data: originData,
    withCredentials: true,
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
