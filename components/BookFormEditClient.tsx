"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateBookRecord, deleteBookRecord } from "@/app/lib/records";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BookFormEditClientProps {
  bookRecord: BookRecord;
}

export default function BookFormEditClient({ bookRecord }: BookFormEditClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState(bookRecord.status);
  const [rating, setRating] = useState(String(bookRecord.rating));
  const [review, setReview] = useState(bookRecord.review);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // FormDataオブジェクトを作成
      const userData = new FormData();
      userData.append("status", status);
      userData.append("rating", rating);
      userData.append("review", review);

      // サーバーアクションを呼び出し
      const result = await updateBookRecord(bookRecord.id, userData);

      if (result.success) {
        // 更新成功時はホームページに遷移
        router.push("/");
        router.refresh();
      } else {
        // エラーメッセージを表示
        setError(result.message);
      }
    } catch (error) {
      console.error("エラー:", error);
      setError("記録の更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // サーバーアクションを呼び出し
      const result = await deleteBookRecord(bookRecord.id);

      if (result.success) {
        // 削除成功時はホームページに遷移
        router.push("/");
        router.refresh();
      } else {
        // エラーメッセージを表示
        setError(result.message);
      }
    } catch (error) {
      console.error("エラー:", error);
      setError("記録の削除に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <Card>
        <CardHeader>
          <CardTitle>{bookRecord.title}</CardTitle>
          <CardDescription>
            著者: {bookRecord.authors.join(", ")}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0">
              <Image
                src={bookRecord.thumbnail || "/placeholder.svg"}
                alt={bookRecord.title}
                width={128}
                height={192}
                className="object-contain"
              />
            </div>
            
            <div className="flex-grow">
              <p className="text-sm text-gray-600 mb-2">
                出版社: {bookRecord.publisher}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                発行日: {bookRecord.published_date}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                価格:{" "}
                {bookRecord.price === "-"
                  ? bookRecord.price
                  : `${bookRecord.price}円`}
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">読書状態</label>
              <Select value={status} onValueChange={setStatus} required>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="未読">未読</SelectItem>
                  <SelectItem value="読書中">読書中</SelectItem>
                  <SelectItem value="読了">読了</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">評価</label>
              <Select value={rating} onValueChange={setRating} required>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">★</SelectItem>
                  <SelectItem value="2">★★</SelectItem>
                  <SelectItem value="3">★★★</SelectItem>
                  <SelectItem value="4">★★★★</SelectItem>
                  <SelectItem value="5">★★★★★</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">レビュー</label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="感想を入力してください"
                className="h-32"
              />
            </div>
            
            <div className="flex justify-between">
              <Button
                type="submit"
                className="w-1/2 mr-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "更新中..." : "更新"}
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-1/2 ml-2"
                    disabled={isSubmitting}
                  >
                    削除
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>読書記録の削除</AlertDialogTitle>
                    <AlertDialogDescription>
                      この読書記録を削除してもよろしいですか？この操作は取り消せません。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      削除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
