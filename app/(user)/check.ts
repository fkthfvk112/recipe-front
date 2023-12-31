export function checkIdLengthValidation(id: string): boolean {
  return id.length >= 6 && id.length <= 12;
}

export function checkIdAlpabetValidation(id: string): boolean {
  const alphaNumericRegex = /^[a-zA-Z0-9]+$/;
  return alphaNumericRegex.test(id);
}

export interface Validation {
  isValid: boolean;
  message: string;
}

export function validationIdSentence(id: string): Validation {
  if (!checkIdLengthValidation(id) || !checkIdAlpabetValidation(id)) {
    return {
      isValid: false,
      message: "6~12자의 영문, 숫자만 사용 가능합니다.",
    };
  }
  return {
    isValid: true,
    message: "유효한 아이디입니다.",
  };
}

export function checkPwLengthValidation(password: string): boolean {
  return password.length >= 8 && password.length <= 20;
}

export function checkPwAlpabetValidation(password: string): boolean {
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
}

export function validationPwSentence(password: string): Validation {
  if (
    !checkPwLengthValidation(password) ||
    !checkPwAlpabetValidation(password)
  ) {
    return {
      isValid: false,
      message: "특수문자, 숫자, 영어를 포함하는 8~20자만 사용 가능합니다.",
    };
  }
  return {
    isValid: true,
    message: "유효한 비밀번호 입니다.",
  };
}

export function isSamePw(pw1: string, pw2: string): boolean {
  return pw1 === pw2;
}

export function validationPwSameSentence(pw1: string, pw2: string): Validation {
  if (pw1 === pw2) {
    return {
      isValid: true,
      message: "비밀번호가 일치합니다.",
    };
  }
  return {
    isValid: false,
    message: "비밀번호가 일치하지 않습니다.",
  };
}

function validateEmail(email: string) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function validationEmailSentence(email: string): Validation {
  if (validateEmail(email)) {
    return {
      isValid: true,
      message: "유효한 이메일 형식입니다..",
    };
  }
  return {
    isValid: false,
    message: "유효하지 않은 이메일 형식입니다.",
  };
}
