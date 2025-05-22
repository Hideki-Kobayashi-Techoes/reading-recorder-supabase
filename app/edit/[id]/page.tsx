"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import BookForm from "@/components/BookForm";

const getBookDetails = async (id: string) => {
  const records = JSON.parse(localStorage.getItem("bookRecords") || "[]");
  const record = records.find((record: RecordedBook) => record.id === id);
  return record;
};

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<RecordedBook | null>(null);
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");

  useEffect(() => {
    getBookDetails(id as string).then((bookDetails) => {
      setBook(bookDetails);
      setStatus(bookDetails.status);
      setRating(bookDetails.rating);
      setReview(bookDetails.review);
    });
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const records = JSON.parse(localStorage.getItem("bookRecords") || "[]");
    const recordIndex = records.findIndex(
      (record: RecordedBook) => record.id === id
    );

    if (recordIndex !== -1) {
      records[recordIndex] = {
        ...records[recordIndex],
        status,
        rating,
        review,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("bookRecords", JSON.stringify(records));
      router.push("/");
    }
  };

  const handleDelete = () => {
    if (confirm("本当に削除してもよろしいですか？")) {
      const records = JSON.parse(localStorage.getItem("bookRecords") || "[]");
      const filteredRecords = records.filter(
        (record: RecordedBook) => record.id !== id
      );
      localStorage.setItem("bookRecords", JSON.stringify(filteredRecords));
      router.push("/");
    }
  };

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
      onDelete={handleDelete}
      pageTitle="読書記録の編集"
      submitButtonText="更新"
    />
  );
}
