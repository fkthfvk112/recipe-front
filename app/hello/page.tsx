"use client";
import { useEffect, useState } from "react";
import { axiosAuthInstacne } from "../(customAxios)/authAxios";

export default function Hello() {
  const [helloText, setHelloText] = useState("");

  useEffect(() => {
    axiosAuthInstacne
      .post("auth-test/hello")
      .then((res) => {
        console.log("성공고오", res);
        setHelloText(res?.data);
      })
      .catch((err) => {
        console.log("에러러러ㅓ", err);
        if (err.response) {
          // 서버에서 에러 응답을 반환한 경우
          // console.log("Status:", err.response.status);
          // console.log("Data:", err.response.data); // 에러 메시지 출력
        }
      });
  }, []);

  return (
    <div>
      {helloText}
      <div>당신은 로그인 하였군요? 축하합니다!</div>
    </div>
  );
}
