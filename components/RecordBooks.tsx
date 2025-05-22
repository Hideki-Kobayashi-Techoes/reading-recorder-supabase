"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import placeholder from "@/public/placeholder.svg";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function RecordBooks({ books }: { books: RecordedBook[] }) {
  const [localBooks, setLocalBooks] = useState(books);

  const handleDelete = (id: string) => {
    if (confirm("本当に削除してもよろしいですか？")) {
      const records = JSON.parse(localStorage.getItem("bookRecords") || "[]");
      const filteredRecords = records.filter(
        (record: RecordedBook) => record.id !== id
      );
      localStorage.setItem("bookRecords", JSON.stringify(filteredRecords));
      setLocalBooks(filteredRecords);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {localBooks.map((book) => (
        <Link href={`/edit/${book.id}`} key={book.id}>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" style={{ color: "#999" }}className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">メニューを開く</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(book.id);
                        }}
                      >
                        削除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Image
                src={book.thumbnail || placeholder}
                alt={book.title}
                className="w-full h-48 object-contain mb-2"
                width={128}
                height={192}
              />
              <p className="text-sm text-gray-600">状態: {book.status}</p>
              <p className="text-sm text-gray-600">評価: {book.rating}</p>
              <p className="text-sm text-gray-600">記録日: {new Date(book.createdAt).toLocaleDateString("ja-JP")}</p>
              <p className="text-sm text-gray-600 line-clamp-2">レビュー: {book.review}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
