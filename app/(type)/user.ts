export interface User {
  userId: string;
  nickName?: string;
  userPassword: string;
  grantType: string;
}

export interface UserLoginDTO extends User {
  role: string;
}

export interface UserSignUpDTO extends User {
  email: string;
  encodedEmail:string;
  sex:SexEnum;
  birthDate:string;
}

export interface NaverSignUpDTO{
  nickName:string;
  grantType:string;
}

export interface Jwt{
  name:string,
  value:string
}

export enum SexEnum{
  MALE   = "m",
  FEMAIL = "f"
}