"use server";
import { cookies } from "next/headers";

export default async function deleteAuthToken() {
  cookies().delete("Authorization");
  cookies().delete("Refresh-token");
}
