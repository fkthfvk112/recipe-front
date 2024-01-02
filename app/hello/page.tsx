import axios from "axios";
import { cookies } from "next/headers";
import { axiosAuthInstacne } from "../(customAxios)/authAxios";
import { redirect } from "next/navigation";

export default async function Hello() {
  let helloText = "";

  const cookie = cookies();
  const auth = cookie.get("Authorization");
  if (auth === undefined) {
    redirect("/signin");
  }

  await axiosAuthInstacne
    .get("auth-test/hello")
    .then((res) => {
      console.log(res.data);
      helloText = res.data;
    })
    .catch((err) => {
      redirect("/signin");
    });

  return (
    <div>
      {helloText}
      <div>당신은 로그인 하였군요? 축하합니다!</div>
    </div>
  );
}
