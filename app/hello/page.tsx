"use client";
import { useEffect, useState } from "react";
import { axiosAuthInstacne } from "../(customAxios)/authAxios";

export default function Hello() {
  const [helloText, setHelloText] = useState("");

  useEffect(() => {
    axiosAuthInstacne
      .post("auth-test/hello")
      .then((res) => {
        setHelloText(res?.data);
      })
      .catch((err) => {
        if (err.response) {
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
