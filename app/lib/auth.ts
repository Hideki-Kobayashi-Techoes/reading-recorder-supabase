"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// 認証状態を確認し、ユーザー情報を返す関数
// ログインしていない場合はnullを返す（リダイレクトしない）
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return user;
}

// 認証が必要なページで使用する関数
// ログインしていない場合はサインインページにリダイレクト
export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  return { supabase, user };
}
