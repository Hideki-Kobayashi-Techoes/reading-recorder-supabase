import SearchResults from "@/components/SearchResults";
import { searchBooks } from "@/app/actions";

// メインの検索ページ
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const paramsData = await searchParams;
  const query = paramsData.q || "";
  const books = await searchBooks(query);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">「{query}」の検索結果</h1>
      {books.length === 0 ? (
        <div className="text-center py-8">
          <p>検索結果がありません。別のキーワードをお試しください。</p>
        </div>
      ) : (
        <SearchResults books={books} />
      )}
    </div>
  );
}
