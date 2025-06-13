"use server";

// Google Books APIから本を検索する関数
export async function searchBooks(query: string): Promise<SearchResult[]> {
  if (!query) return [];
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
    published_date: item.volumeInfo.publishedDate || "-",
    publisher: item.volumeInfo.publisher || "-",
  }));
}

// 本の詳細を取得する関数
export async function getBookDetails(id: string): Promise<SearchResult> {
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
    published_date: item.volumeInfo.publishedDate || "-",
    publisher: item.volumeInfo.publisher || "-",
  };
}
