export interface Review {
  reviewId:       number;
  userId:         number;
  score?:         number;
  message:        string;
  recipeId:       number|string;
  checkAnonymous: boolean;
  parentReviewId: number|string;
  isDel:          boolean;
  createdAt?:     string;
}

export interface ReviewWithUserInfo extends Review {
  userInfo: userInfo;
}

export interface BoardReview{
  reviewId:       number;
  userId:         number;
  message:        string;
  boardId:        number|string;
  checkAnonymous: boolean;
  parentReviewId: number|string;
  isDel:          boolean;
  createdAt?:     string;
}

export interface BoardReviewWithUserInfo extends BoardReview {
  userInfo: userInfo;
}


export interface userInfo {
  userId:       string;
  userNickName: string;
  userUrl:      string | null;
  userPhoto:    string | null;
}
