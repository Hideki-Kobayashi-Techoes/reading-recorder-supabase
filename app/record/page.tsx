import { getBookDetails } from "@/app/lib/google_books";
import { getBookRecord } from "@/app/lib/records";
import BookFormClient from "@/components/BookFormClient";
import BookFormEditClient from "@/components/BookFormEditClient";

interface RecordPageProps {
  searchParams: {
    id?: string;
  };
}

// 記録ページ（新規作成と編集を統合）
export default async function RecordPage({ searchParams }: RecordPageProps) {
  const paramsData = await searchParams;
  const bookId = paramsData.id;

  try {
    // 本のIDがない場合はエラー
    if (!bookId) {
      throw new Error("本のIDが指定されていません");
    }
    
    // Google Book IDで既存の読書記録があるか確認
    const existingRecord = await getBookRecord(bookId);

    // 既存の記録がある場合は編集モード
    if (existingRecord) {
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">読書記録の編集</h1>
          <BookFormEditClient bookRecord={existingRecord} />
        </div>
      );
    }

    // 既存の記録がない場合は新規作成モード
    // 本の詳細をGoogle Books APIから取得
    const book = await getBookDetails(bookId);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">読書記録に保存</h1>
        <BookFormClient book={book} />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">エラー: </strong>
          <span className="block sm:inline">本の詳細または読書記録の取得に失敗しました</span>
        </div>
      </div>
    );
  }
}
