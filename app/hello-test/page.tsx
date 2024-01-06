"use client";
import { useEffect, useState } from "react";
import { axiosAuthInstacne } from "../(customAxios)/authAxios";

export default function Hello2() {
  const [helloText, setHelloText] = useState("hello");

  const getNewAccess = () => {
    axiosAuthInstacne
      .get(`auth-test/hello`)
      .then((res) => {
        console.log("아시오스", res.data);
        setHelloText(res.data);
      })
      .catch((err) => {
        console.log("아시오스 에러", err);
      });
  };

  return (
    <div>
      {helloText}
      <button onClick={getNewAccess}>새 액세스 받기</button>
    </div>
  );
}
