import { forgotPasswordAction } from "@/app/lib/auth-actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuccessMessage } from "@/components/SucessMessage";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  
  if ("success" in searchParams) {
    return (
      <SuccessMessage
        title="メール送信完了"
        message={searchParams.success}
        description="メール内のリンクをクリックして、パスワードの再設定を完了してください。"
      />
    );
  }
  
  return (
    <>
      <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
        <div>
          <h1 className="text-2xl font-medium">パスワードの再設定</h1>
          <p className="text-sm text-secondary-foreground">
            アカウントを持っていない場合は{" "}
            <Link className="text-primary underline" href="/sign-in">
              ログイン
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">メールアドレス</Label>
          <Input name="email" placeholder="メールアドレス" required />
          <SubmitButton formAction={forgotPasswordAction} pendingText="送信中...">
            送信
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
