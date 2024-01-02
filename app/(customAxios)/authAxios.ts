import axios from "axios";
import https from "https";
import { cookies } from "next/headers";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const axiosAuthInstacne = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
  httpsAgent: httpsAgent,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAuthInstacne.interceptors.request.use(
  (config) => {
    const cookie = cookies();
    const authToken = cookie.get("Authorization");
    if (authToken === undefined) {
      return Promise.reject(new Error("Authorization token is undefined"));
    }
    config.headers.Cookie = encodeURIComponent(
      `Authorization=${authToken.value}`
    ); //공백 처리하기

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
