import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface BookListProps {
  books: BookRecord[];
}

export default function BookList({ books }: BookListProps) {
  // 読書状態に応じたバッジの色を設定
  const getStatusColor = (status: string) => {
    switch (status) {
      case "未読":
        return "bg-gray-500";
      case "読書中":
        return "bg-blue-500";
      case "読了":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // 評価を星の数で表示
  const renderRating = (rating: string) => {
    const ratingNum = parseInt(rating, 10);
    return "★".repeat(ratingNum) + "☆".repeat(5 - ratingNum);
  };

  // 読書記録が空の場合のメッセージ表示
  if (books.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-md p-6 flex items-center justify-center w-full">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="h-12 w-12 text-blue-400 mb-4" />
          <h3 className="text-lg font-medium text-blue-900 mb-2">読書記録がありません</h3>
          <p className="text-blue-700">本を追加して、あなたの読書記録を始めましょう。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <Link href={`/record?id=${book.google_book_id}`} key={book.id}>
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-2">
                {book.title}
              </CardTitle>
              <p className="text-sm text-gray-600 line-clamp-1">
                {book.authors.join(", ")}
              </p>
            </CardHeader>
            <CardContent className="flex space-x-4 pb-2">
              <div className="flex-shrink-0">
                <Image
                  src={book.thumbnail || "/placeholder.svg"}
                  alt={book.title}
                  width={80}
                  height={120}
                  className="object-contain"
                />
              </div>
              <div className="flex-grow">
                <p className="text-sm mb-1 line-clamp-1">
                  出版社: {book.publisher}
                </p>
                <p className="text-sm mb-1">発行日: {book.published_date}</p>
                <Badge className={getStatusColor(book.status)}>
                  {book.status}
                </Badge>
                <p className="text-sm mt-2">
                  {renderRating(book.rating.toString())}
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <p className="text-sm text-gray-700 line-clamp-2">
                {book.review}
              </p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
