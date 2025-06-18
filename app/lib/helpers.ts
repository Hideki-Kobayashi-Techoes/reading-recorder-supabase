"use server";

import { SupabaseClient } from "@supabase/supabase-js";

// ビューから取得したデータをBookRecord形式に整形する関数
export async function formatBookRecord(data: any): Promise<BookRecord> {
  return {
    id: data.id,
    book_id: data.book_id,
    google_book_id: data.google_book_id,
    title: data.title,
    authors: data.authors || [],
    publisher: data.publisher || "",
    published_date: data.published_date || "",
    thumbnail: data.thumbnail || "",
    price: data.price || 0,
    status: data.status || "未読",
    rating: data.rating || 0,
    review: data.review || "",
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

// 本を取得または作成する関数
export async function getOrCreateBook(
  supabase: SupabaseClient,
  book: SearchResult
): Promise<string> {
  // 既存の本を検索
  const { data: existingBook } = await supabase
    .from("books")
    .select("id")
    .eq("google_book_id", book.id)
    .single();

  // 既存の本を使用
  if (existingBook) {
    return existingBook.id;
  }

  // PostgreSQL関数を使用してトランザクション内で本と著者を同時に作成
  const { data, error } = await supabase.rpc("create_book_with_authors", {
    p_google_book_id: book.id,
    p_title: book.title,
    p_publisher: book.publisher,
    p_published_date: book.published_date,
    p_thumbnail: book.thumbnail,
    p_price: book.price,
    p_authors: book.authors,
  });

  if (error) throw error;
  return data;
}
