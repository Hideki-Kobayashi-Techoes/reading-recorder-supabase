"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import BookForm from "@/components/BookForm";

const getBookDetails = async (id: string): Promise<SearchResult> => {
  const response = await fetch(`/api/books/${id}`);
  if (!response.ok) {
    throw new Error("本の詳細の取得に失敗しました");
  }
  return response.json();
};

const RecordPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = searchParams.get("id");
  const [book, setBook] = useState<SearchResult | null>(null);
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) return;

    getBookDetails(bookId)
      .then((book) => {
        setBook(book);
      })
      .catch((err) => {
        setError("本の詳細の取得に失敗しました");
        console.error(err);
      });
  }, [bookId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!book) {
        throw new Error("本の詳細が取得できません");
      }

      const existingRecords = localStorage.getItem("bookRecords");
      const records = existingRecords ? JSON.parse(existingRecords) : [];

      const record: RecordedBook = {
        id: self.crypto.randomUUID(),
        title: book?.title,
        authors: book?.authors,
        thumbnail: book?.thumbnail,
        price: book?.price,
        publisher: book?.publisher,
        publishedDate: book?.publishedDate,
        status,
        rating,
        review,
        createdAt: new Date().toISOString(),
      };

      records.push(record);
      localStorage.setItem("bookRecords", JSON.stringify(records));
      router.push("/");
    } catch (error) {
      console.error("エラー:", error);
      setError("記録の送信に失敗しました");
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!book) return <div>読み込み中...</div>;

  return (
    <BookForm
      book={book}
      status={status}
      rating={rating}
      review={review}
      onStatusChange={setStatus}
      onRatingChange={setRating}
      onReviewChange={(e) => setReview(e.target.value)}
      onSubmit={handleSubmit}
      pageTitle="読書記録に保存"
      submitButtonText="保存"
    />
  );
};

export default function RecordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecordPageContent />
    </Suspense>
  );
}
