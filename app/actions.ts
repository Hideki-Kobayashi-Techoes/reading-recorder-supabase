"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

// Google Books APIから本を検索する関数
export async function searchBooks(query: string): Promise<SearchResult[]> {
  if (!query) return [];
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`,
      { next: { revalidate: 3600 } } // 1時間キャッシュ
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.items) return [];
    
    // Google Books APIのレスポンスをアプリで使用する形式に変換
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ["-"],
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg",
      price: item.saleInfo.listPrice?.amount || "-",
      publishedDate: item.volumeInfo.publishedDate || "-",
      publisher: item.volumeInfo.publisher || "-",
    }));
  } catch (error) {
    console.error("本の検索中にエラーが発生しました:", error);
    return [];
  }
}

// 本の詳細を取得する関数
export async function getBookDetails(id: string): Promise<SearchResult> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const item = await response.json();
    
    return {
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ["-"],
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg",
      price: item.saleInfo?.listPrice?.amount || "-",
      publishedDate: item.volumeInfo.publishedDate || "-",
      publisher: item.volumeInfo.publisher || "-",
    };
  } catch (error) {
    console.error("本の詳細取得中にエラーが発生しました:", error);
    throw new Error("本の詳細の取得に失敗しました");
  }
}

// 読書記録を保存する関数
export async function saveBookRecord(formData: FormData) {
  try {
    const bookId = formData.get("bookId") as string;
    const status = formData.get("status") as string;
    const rating = formData.get("rating") as string;
    const review = formData.get("review") as string;
    
    if (!bookId) {
      throw new Error("本のIDが指定されていません");
    }
    
    // 本の詳細を取得
    const book = await getBookDetails(bookId);
    
    // ここではSupabaseに保存する代わりにレスポンスを返す
    // 実際の実装では、ここでSupabaseにデータを保存する処理を行う
    
    return { success: true, message: "読書記録を保存しました" };
  } catch (error) {
    console.error("読書記録の保存中にエラーが発生しました:", error);
    return { success: false, message: "読書記録の保存に失敗しました" };
  }
}
