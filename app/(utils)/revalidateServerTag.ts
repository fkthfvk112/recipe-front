"use server";
import { revalidateTag } from "next/cache";

export const revalidateByTagName = (tagName: string) => {
  revalidateTag(tagName);
};
