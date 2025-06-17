import { resetPasswordAction } from "@/app/lib/auth-actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
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
