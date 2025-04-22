import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

// 型定義
type ReadingStat = {
  status: string;
  count: number;
};

type BookAuthor = {
  author_name: string;
};

type Book = {
  id: string;
  title: string;
  thumbnail?: string;
  book_authors?: BookAuthor[];
};

export default async function SupabaseTestPage() {
  const supabase = await createClient();

  // 現在のユーザー情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ユーザーが認証されていない場合はサインインページにリダイレクト
  if (!user) {
    return redirect("/sign-in");
  }

  // テスト用に本のデータを取得
  const { data: books, error: booksError } = await supabase
    .from("books")
    .select("*, book_authors(*)")
    .eq("user_id", user.id)
    .limit(10) as { data: Book[] | null, error: any };

  // 読書状態の統計を取得
  const { data: readingStats, error: statsError } = await supabase
    .rpc("get_reading_stats", { user_uuid: user.id }) as { data: ReadingStat[] | null, error: any };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Supabaseテストページ</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>ユーザー情報</CardTitle>
            <CardDescription>現在ログインしているユーザーの情報</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md overflow-auto">
              <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>読書統計</CardTitle>
            <CardDescription>読書状態ごとの本の数</CardDescription>
          </CardHeader>
          <CardContent>
            {statsError ? (
              <p className="text-destructive">エラー: {statsError.message}</p>
            ) : !readingStats || (readingStats as any[]).length === 0 ? (
              <p>データがありません。本を追加してください。</p>
            ) : (
              <div className="space-y-2">
                {(readingStats as ReadingStat[]).map((stat: ReadingStat) => (
                  <div key={stat.status} className="flex justify-between items-center">
                    <span>{stat.status}:</span>
                    <span className="font-bold">{stat.count}冊</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>本のリスト</CardTitle>
          <CardDescription>あなたが登録した本の一覧</CardDescription>
        </CardHeader>
        <CardContent>
          {booksError ? (
            <p className="text-destructive">エラー: {booksError.message}</p>
          ) : !books || books.length === 0 ? (
            <div className="text-center py-8">
              <p className="mb-4">まだ本が登録されていません</p>
              <Button asChild>
                <a href="/add-book">本を追加する</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <Card key={book.id} className="overflow-hidden">
                  <div className="aspect-[2/3] relative bg-muted">
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold truncate">{book.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {book.book_authors?.map((a: BookAuthor) => a.author_name).join(", ")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
