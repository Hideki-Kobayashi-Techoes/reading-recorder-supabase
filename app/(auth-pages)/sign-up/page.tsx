import { signUpAction } from "@/app/lib/auth-actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { SuccessMessage } from "@/components/SucessMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  
  if ("success" in searchParams) {
    return (
      <SuccessMessage
        title="登録完了"
        message={searchParams.success}
        description="メール内のリンクをクリックして、パスワードの再設定を完了してください。"
      />
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
