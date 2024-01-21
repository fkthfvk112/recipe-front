export interface Review {
  userId: number;
  score: number;
  message: string;
  recipeId: number;
  createdAt?: string;
}

export interface ReviewWithUserInfo extends Review {
  userInfo: userInfo;
}

export interface userInfo {
  userId: number;
  userNickName: string;
  userUrl: string | null;
  userPhoto: string | null;
}
