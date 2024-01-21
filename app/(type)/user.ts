export interface User {
  userId: string;
  nickName: string;
  userPassword: string;
  grantType: string;
}

export interface UserLoginDTO extends User {
  role: string;
}

export interface UserSignUpDTO extends User {
  email: string;
}
