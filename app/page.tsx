import { getBookRecords } from "./actions";
import BookList from "@/components/BookList";

export default async function Home() {
  try {
    // サーバーアクションを使用して読書記録を取得
    const books = await getBookRecords();
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <main className="container mx-auto px-4 py-16">
          {/* 読書記録が0件の場合LPを表示 */}
          {books.length === 0 ? (
            <>
              <h1 className="text-4xl font-bold text-center mb-8">Reading Recorder</h1>
              <p className="text-xl text-center mb-12">簡単に本を検索し、あなたの読書の旅を記録しましょう。</p>
              <div className="space-y-8">
                <section className="text-center">
                  <h2 className="text-2xl font-semibold mb-4">機能</h2>
                  <ul className="list-disc list-inside text-left max-w-md mx-auto">
                    <li>Google Books APIを使用した本の検索</li>
                    <li>詳細な本の情報の表示</li>
                    <li>読んだ本の記録</li>
                    <li>読書の進捗管理</li>
                  </ul>
                </section>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">あなたの読書記録</h1>
              </div>
              
              {/* 読書状態ごとの集計 */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <p className="text-lg font-semibold">未読</p>
                  <p className="text-2xl">{books.filter(book => book.status === "未読").length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <p className="text-lg font-semibold">読書中</p>
                  <p className="text-2xl">{books.filter(book => book.status === "読書中").length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <p className="text-lg font-semibold">読了</p>
                  <p className="text-2xl">{books.filter(book => book.status === "読了").length}</p>
                </div>
              </div>
              
              {/* 読書記録一覧 */}
              <BookList books={books} />
            </>
          )}
        </main>
      </div>
    );
  } catch (error) {
    // エラーが発生した場合はエラーメッセージを表示
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <main className="container mx-auto px-4 py-16">
          <div className="text-red-500 text-center">
            <h1 className="text-2xl font-bold mb-4">エラーが発生しました</h1>
            <p>読書記録の取得中にエラーが発生しました。再度お試しください。</p>
          </div>
        </main>
      </div>
    );
  }
}
