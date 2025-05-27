import { getRecordById } from "@/app/actions";
import BookFormEditClient from "@/components/BookFormEditClient";

// 編集ページ
export default async function EditPage({
  params
}: {
  params: { id: string }
}) {
  const paramsData = await params;
  const recordId = paramsData.id;
  
  try {
    // 読書記録を取得
    const book = await getRecordById(recordId);
    
    if (!book) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-red-500">記録が見つかりませんでした</div>
        </div>
      );
    }
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">読書記録の編集</h1>
        <BookFormEditClient book={book} recordId={recordId} />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500">読書記録の取得に失敗しました</div>
      </div>
    );
  }
}
