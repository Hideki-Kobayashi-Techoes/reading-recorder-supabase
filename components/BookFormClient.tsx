"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveBookRecord } from "@/app/actions";
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

interface BookFormClientProps {
  book: SearchResult;
  bookId: string;
}

export default function BookFormClient({ book, bookId }: BookFormClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // FormDataオブジェクトを作成
      const formData = new FormData();
      formData.append("bookId", bookId);
      formData.append("status", status);
      formData.append("rating", rating);
      formData.append("review", review);

      // サーバーアクションを呼び出し
      const result = await saveBookRecord(formData);

      if (result.success) {
        // 保存成功時はホームページに遷移
        router.push("/");
        router.refresh();
      } else {
        // エラーメッセージを表示
        setError(result.message);
      }
    } catch (error) {
      console.error("エラー:", error);
      setError("記録の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <Card>
        <CardHeader>
          <CardTitle>{book.title}</CardTitle>
          <CardDescription>著者: {book.authors.join(", ")}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0">
              <Image
                src={book.thumbnail || "/placeholder.svg"}
                alt={book.title}
                width={128}
                height={192}
                className="object-contain"
              />
            </div>
            
            <div className="flex-grow">
              <p className="text-sm text-gray-600 mb-2">出版社: {book.publisher}</p>
              <p className="text-sm text-gray-600 mb-2">発行日: {book.publishedDate}</p>
              <p className="text-sm text-gray-600 mb-2">価格: {book.price === "-" ? book.price : `${book.price}円`}</p>
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
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "保存中..." : "保存"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
