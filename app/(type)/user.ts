export enum GrantType {
  NORMAL = "NORMAL",
  NAVER = "NAVER",
  KAKAO = "KAKAO",
  GOOGLE = "GOOGLE",
}

export interface User {
  userId: string;
  nickName?: string;
  userPassword?: string;
  grantType: GrantType | string;
}

export interface UserLoginDTO {
  userId: string;
  userPassword?: string;
  grantType: GrantType | string;
  role: string;
}

export interface UserSignUpDTO extends User {
  email: string;
  encodedEmail: string;
  sex: SexEnum;
  birthDate: string;
}

export interface NaverSignUpDTO {
  nickName: string;
  grantType: GrantType | string;
}

export interface KakaoSignUpDTO {
  nickName: string;
  email?: string;
  grantType: GrantType | string;
}

export interface GoogleSignUpDTO {
  nickName: string;
  email?: string;
  grantType: GrantType | string;
}

export interface Jwt {
  name: string;
  value: string;
}

export enum SexEnum {
  MALE = "m",
  FEMAIL = "f",
}