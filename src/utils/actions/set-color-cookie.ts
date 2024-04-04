"use server";

import { cookies } from "next/headers";

export async function setColorCookie(hex: string) {
  cookies().set("keyColor", hex);
}
