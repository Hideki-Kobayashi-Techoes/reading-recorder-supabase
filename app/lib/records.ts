"use server";

import { requireAuth } from "@/app/lib/auth";

import { formatBookRecord, getOrCreateBook } from "@/app/lib/helpers";

// 読書記録の一覧を取得する関数
export async function getBookRecords(): Promise<BookRecord[]> {
  const { supabase, user } = await requireAuth();

  // reading_records_with_booksビューを使用
  const { data, error } = await supabase
    .from("reading_records_with_books")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  // データを整形
  return await Promise.all(data.map((item: any) => formatBookRecord(item)));
}

// Google Book IDから読書記録を取得する関数
export async function getBookRecord(
  googleBookId: string
): Promise<BookRecord | null> {
  const { supabase, user } = await requireAuth();

  const { data, error } = await supabase
    .from("reading_records_with_books")
    .select("*")
    .eq("google_book_id", googleBookId)
    .eq("user_id", user.id)
    .single();

  // レコードが見つからないエラーの場合はnullを返す
  if (error?.code === "PGRST116") {
    return null;
  }

  if (error) {
    throw error;
  }

  return formatBookRecord(data);
}

// 読書記録を新規作成する関数
export async function saveBookRecord(book: SearchResult, userData: FormData) {
  const { supabase, user } = await requireAuth();

  const insertData = {
    book_id: "", // 一時的に空文字列を設定
    user_id: user.id,
    status: userData.get("status") as string,
    rating: parseInt(userData.get("rating") as string) || 0,
    review: userData.get("review") as string,
  };

  // 本を取得または作成
  const bookId = await getOrCreateBook(supabase, book);
  insertData.book_id = bookId;

  // reading_recordsテーブルに読書記録を挿入
  const { error } = await supabase.from("reading_records").insert(insertData);

  if (error) {
    throw error;
  }

  return { success: true, message: "読書記録を作成しました" };
}

// 読書記録を更新する関数
export async function updateBookRecord(recordId: string, userData: FormData) {
  const { supabase, user } = await requireAuth();

  const updateData = {
    status: userData.get("status") as string,
    rating: parseInt(userData.get("rating") as string) || 0,
    review: userData.get("review") as string,
  };

  // データを更新し、更新された行を返す
  const { data, error } = await supabase
    .from("reading_records")
    .update(updateData)
    .eq("id", recordId)
    .eq("user_id", user.id)
    .select(); // 更新された行を返す

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error("読書記録が見つからないか、アクセス権がありません");
  }

  return { success: true, message: "読書記録を更新しました" };
}

// 読書記録を削除する関数
export async function deleteBookRecord(recordId: string) {
  const { supabase, user } = await requireAuth();

  // データを削除
  const { data, error } = await supabase
    .from("reading_records")
    .delete()
    .eq("id", recordId)
    .eq("user_id", user.id)
    .select(); // 削除された行を返す

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error("読書記録が見つからないか、アクセス権がありません");
  }

  return { success: true, message: "読書記録を削除しました" };
}
