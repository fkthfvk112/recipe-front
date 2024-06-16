export interface Review {
  reviewId: number;
  userId: number; //have to :: string으로 바꾸고 암호화
  score?: number;
  message: string;
  recipeId: number|string;
  parentReviewId:number|string;
  createdAt?: string;
}

export interface ReviewWithUserInfo extends Review {
  userInfo: userInfo;
}

export interface BoardReview{
  reviewId: number;
  userId: number; //have to :: string으로 바꾸고 암호화
  message: string;
  boardId: number|string;
  checkAnonymous:boolean;
  parentReviewId:number|string;
  createdAt?: string;
}

export interface BoardReviewWithUserInfo extends BoardReview {
  userInfo: userInfo;
}


export interface userInfo {
  userId: string;
  userNickName: string;
  userUrl: string | null;
  userPhoto: string | null;
}
