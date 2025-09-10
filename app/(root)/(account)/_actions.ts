"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from '@/auth';

export async function updateName(data: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  try {
    const value = data.get("value") as string;
    if (!value || value === session?.user.name) return;
    await auth.api.updateUser({ headers: h, body: { name: value } });
    revalidatePath("/", "layout");
  } catch {}
}

export async function updateAvatar(path: string) {
  const h = await headers();
  try {
    await auth.api.updateUser({ headers: h, body: { image: path } });
    revalidatePath("/", "layout");
  } catch {

  }
}

export async function updateUsername(data: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  try {
    const value = data.get("value") as string;
    if (!value || value === session?.user.username) return;
    await auth.api.updateUser({ headers: h, body: { username: value } });
    revalidatePath("/", "layout");
  } catch {}
}

export async function updateEmail(data: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  try {
    const value = data.get("value") as string;
    if (!value || value === session?.user.email) return;
    await auth.api.changeEmail({ headers: h, body: { newEmail: value } });
    revalidatePath("/", "layout");
  } catch {}
}

export async function updatePassword(data: FormData) {
  const h = await headers();
  try {
    const currentPassword = data.get("currentPassword") as string;
    const newPassword = data.get("newPassword") as string;
    await auth.api.changePassword({
      headers: h,
      body: { newPassword: newPassword, currentPassword: currentPassword },
    });
  } catch {}
}

export async function deleteAccount(data: FormData) {
  const h = await headers();
  try {
    const password = data.get("value") as string;
    await auth.api.deleteUser({ headers: h, body: { password } });
    revalidatePath("/", "layout");
  } catch {}
}
