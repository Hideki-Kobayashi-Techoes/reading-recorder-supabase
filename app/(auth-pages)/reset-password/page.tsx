import { resetPasswordAction } from "@/app/lib/auth-actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  
  if ("success" in searchParams) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-w-64 max-w-64 mx-auto gap-6 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium">パスワード変更完了</h1>
          <div className="bg-green-50 text-green-800 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p>{searchParams.success}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">新しいパスワードでログインできるようになりました。</p>
        </div>
        <Link className="text-primary underline" href="/">
          トップページに戻る
        </Link>
      </div>
    );
  }
  
  // 通常のフォーム表示
  return (
    <form className="flex flex-col min-w-64 max-w-64 mx-auto gap-2 [&>input]:mb-3">
      <h1 className="text-2xl font-medium">パスワードの再設定</h1>
      <p className="text-sm text-foreground/60">
        新しいパスワードを入力してください。
      </p>
      <Label htmlFor="password">新しいパスワード</Label>
      <Input
        type="password"
        name="password"
        placeholder="新しいパスワード"
        required
      />
      <Label htmlFor="confirmPassword">新しいパスワード(確認)</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="新しいパスワード(確認)"
        required
      />
      <SubmitButton formAction={resetPasswordAction} pendingText="送信中...">
        送信
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
