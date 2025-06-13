// 検索結果の本の情報（Google Books APIから取得）
type SearchResult = {
  id: string; // Google Books ID
  title: string;
  authors: string[];
  thumbnail?: string;
  price?: string;
  publisher?: string;
  published_date?: string;
};

// 読書記録と本の情報を結合した型（ビューから取得）
type BookRecord = {
  id: string; // 読書記録ID
  book_id: string;
  google_book_id: string;
  title: string;
  authors: string[]; // 著者名の配列
  thumbnail?: string;
  price?: string;
  publisher?: string;
  published_date?: string;
  status: string;
  rating: number;
  review: string;
  created_at: string;
  updated_at: string;
};
