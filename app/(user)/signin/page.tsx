import { Metadata } from "next";
import LoginForm from "./loginForm";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "로그인 - 머그인",
    description:"재료를 공유하고 관리하고 소비해요. 낭비없는 삶 머그인",
    icons:{
      icon:"/common/favicon.png"
    },
    openGraph:{
      title: "머그인",
      description:"재료를 공유하고 관리하고 소비해요. 낭비없는 삶 머그인",
    }
  }
}
 
export default function SignIn() {
  return <LoginForm></LoginForm>;
}
