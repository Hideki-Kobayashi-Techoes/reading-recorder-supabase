import { signUpAction } from "@/app/lib/auth-actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  
  if ("success" in searchParams) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-w-64 max-w-64 mx-auto gap-6 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium">登録完了</h1>
          <div className="bg-green-50 text-green-800 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p>{searchParams.success}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">メール内のリンクをクリックして登録を完了してください。</p>
        </div>
        <Link className="text-primary underline" href="/">
          トップページに戻る
        </Link>
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">新規登録</h1>
        <p className="text-sm text text-foreground">
          既にアカウントを持っている場合は{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            ログイン
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">メールアドレス</Label>
          <Input name="email" placeholder="メールアドレス" required />
          <Label htmlFor="password">パスワード</Label>
          <Input
            type="password"
            name="password"
            placeholder="パスワード"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="送信中...">
            送信
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
