import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookListProps {
  books: RecordedBook[];
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <Link href={`/edit/${book.id}`} key={book.id}>
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
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
                <p className="text-sm mb-1 line-clamp-1">出版社: {book.publisher}</p>
                <p className="text-sm mb-1">発行日: {book.publishedDate}</p>
                <Badge className={getStatusColor(book.status)}>{book.status}</Badge>
                <p className="text-sm mt-2">{renderRating(book.rating)}</p>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <p className="text-sm text-gray-700 line-clamp-2">{book.review}</p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
