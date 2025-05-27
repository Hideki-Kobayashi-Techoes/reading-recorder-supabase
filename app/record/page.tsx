import { getBookDetails } from "@/app/actions";
import BookFormClient from "@/components/BookFormClient";

// 記録ページ
export default async function RecordPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const paramsData = await searchParams;
  const bookId = paramsData.id;
  
  // 本のIDがない場合はエラー表示
  if (!bookId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500">本のIDが指定されていません</div>
      </div>
    );
  }
  
  try {
    // 本の詳細を取得
    const book = await getBookDetails(bookId);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">読書記録に保存</h1>
        <BookFormClient book={book} bookId={bookId} />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500">本の詳細の取得に失敗しました</div>
      </div>
    );
  }
}
