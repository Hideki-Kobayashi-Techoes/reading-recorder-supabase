export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <main className="container mx-auto px-4 py-16">
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
      </main>
    </div>
  );
}
