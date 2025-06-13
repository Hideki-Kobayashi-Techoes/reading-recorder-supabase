import SearchResults from "@/components/SearchResults";
import { searchBooks } from "@/app/lib/google_books";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

// メインの検索ページ
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const paramsData = await searchParams;
  const query = paramsData.q || "";
  
  try {
    const books = await searchBooks(query);
    
    // 検索結果がない場合
    if (books.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">「{query}」の検索結果</h1>
          <div className="text-center py-8">
            <p>検索結果がありません。別のキーワードをお試しください。</p>
          </div>
        </div>
      );
    }
    
    // 検索結果がある場合
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">「{query}」の検索結果</h1>
        <SearchResults books={books} />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">エラー: </strong>
          <span className="block sm:inline">検索処理中にエラーが発生しました</span>
        </div>
      </div>
    );
  }
}
