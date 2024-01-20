export interface Review {
  userId: number;
  score: number;
  message: string;
  recipeId: number;
  createdAt?: string;
}
