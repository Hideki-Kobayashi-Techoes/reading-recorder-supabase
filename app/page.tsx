import { getBookRecords } from "@/app/lib/records";
import { getCurrentUser } from "@/app/lib/auth";
import BookRecordList from "@/components/BookRecordList";
import WelcomePage from "@/components/WelcomePage";

export default async function Home() {
  // 認証チェック
  const user = await getCurrentUser();
  
  // ログインしていない場合はウェルカムページを表示
  if (!user) {
    return <WelcomePage />;
  }
  
  try {
    // サーバーアクションを使用して読書記録を取得
    const bookRecords = await getBookRecords();
    
    // 読書記録がある場合
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <main className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">あなたの読書記録</h1>
          </div>
          
          {/* 読書状態ごとの集計 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-lg font-semibold">未読</p>
              <p className="text-2xl">{bookRecords.filter(bookRecord => bookRecord.status === "未読").length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-lg font-semibold">読書中</p>
              <p className="text-2xl">{bookRecords.filter(bookRecord => bookRecord.status === "読書中").length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-lg font-semibold">読了</p>
              <p className="text-2xl">{bookRecords.filter(bookRecord => bookRecord.status === "読了").length}</p>
            </div>
          </div>
          
          {/* 読書記録一覧 */}
          <BookRecordList bookRecords={bookRecords} />
        </main>
      </div>
    );
  } catch (error) {
    // エラーが発生した場合はエラーメッセージを表示
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <main className="container mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">エラー: </strong>
            <span className="block sm:inline">読書記録の取得中にエラーが発生しました。再度お試しください。</span>
          </div>
        </main>
      </div>
    );
  }
}
