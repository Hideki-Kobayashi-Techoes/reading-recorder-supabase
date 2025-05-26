"use server";

import { createClient } from "@/utils/supabase/server";

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

// 読書記録を取得する関数
export async function getRecordById(id: string): Promise<RecordedBook | null> {
  try {
    // ここではSupabaseからデータを取得する代わりにダミーデータを返す
    // 実際の実装では、ここでSupabaseからデータを取得する処理を行う
    
    // ダミーデータの例
    return {
      id,
      title: "テストタイトル",
      authors: ["テスト著者"],
      thumbnail: "/placeholder.svg",
      price: "1500",
      publisher: "テスト出版社",
      publishedDate: "2023-01-01",
      status: "読了",
      rating: "5",
      review: "とても良い本でした。",
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("読書記録の取得中にエラーが発生しました:", error);
    return null;
  }
}

// 読書記録を更新する関数
export async function updateBookRecord(formData: FormData) {
  try {
    const recordId = formData.get("recordId") as string;
    const status = formData.get("status") as string;
    const rating = formData.get("rating") as string;
    const review = formData.get("review") as string;
    
    if (!recordId) {
      throw new Error("記録IDが指定されていません");
    }
    
    // ここではSupabaseに更新する代わりにレスポンスを返す
    // 実際の実装では、ここでSupabaseのデータを更新する処理を行う
    
    return { success: true, message: "読書記録を更新しました" };
  } catch (error) {
    console.error("読書記録の更新中にエラーが発生しました:", error);
    return { success: false, message: "読書記録の更新に失敗しました" };
  }
}

// 読書記録を削除する関数
export async function deleteBookRecord(formData: FormData) {
  try {
    const recordId = formData.get("recordId") as string;
    
    if (!recordId) {
      throw new Error("記録IDが指定されていません");
    }
    
    // ここではSupabaseから削除する代わりにレスポンスを返す
    // 実際の実装では、ここでSupabaseのデータを削除する処理を行う
    
    return { success: true, message: "読書記録を削除しました" };
  } catch (error) {
    console.error("読書記録の削除中にエラーが発生しました:", error);
    return { success: false, message: "読書記録の削除に失敗しました" };
  }
}

// 読書記録の一覧を取得する関数
export async function getBookRecords(): Promise<RecordedBook[]> {
  try {
    // ここではSupabaseからデータを取得する代わりにダミーデータを返す
    // 実際の実装では、ここでSupabaseからデータを取得する処理を行う
    const supabase = await createClient();
    
    // ユーザー情報を取得
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("認証されていません");
    }
    
    // ダミーデータの例
    return [
      {
        id: "1",
        title: "リーダブルコード",
        authors: ["Dustin Boswell", "Trevor Foucher"],
        thumbnail: "https://books.google.com/books/content?id=Wx1dLwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
        price: "2600",
        publisher: "オライリージャパン",
        publishedDate: "2012-06-23",
        status: "読了",
        rating: "5",
        review: "プログラミングの基本的な考え方が学べる良書です。",
        createdAt: "2023-01-15T09:00:00.000Z"
      },
      {
        id: "2",
        title: "達人プログラマー",
        authors: ["Andrew Hunt", "David Thomas"],
        thumbnail: "https://books.google.com/books/content?id=7EuEoQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
        price: "3200",
        publisher: "オーム社",
        publishedDate: "2020-11-17",
        status: "読書中",
        rating: "4",
        review: "プログラマーとしての姿勢や考え方について深く考えさせられます。",
        createdAt: "2023-02-20T15:30:00.000Z"
      },
      {
        id: "3",
        title: "プログラミング言語Go",
        authors: ["Alan A.A. Donovan", "Brian W. Kernighan"],
        thumbnail: "https://books.google.com/books/content?id=3JWQswEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
        price: "3600",
        publisher: "丸善出版",
        publishedDate: "2016-06-20",
        status: "未読",
        rating: "3",
        review: "Go言語の基本を学ぶために購入しました。まだ読み始めていません。",
        createdAt: "2023-03-10T18:45:00.000Z"
      }
    ];
  } catch (error) {
    console.error("読書記録の一覧取得中にエラーが発生しました:", error);
    return [];
  }
}
