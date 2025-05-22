import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

type BookFormProps = {
  book: SearchResult | RecordedBook;
  status: string;
  rating: string;
  review: string;
  onStatusChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onReviewChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  pageTitle: string;
  submitButtonText: string;
};

export default function BookForm({
  book,
  status,
  rating,
  review,
  onStatusChange,
  onRatingChange,
  onReviewChange,
  onSubmit,
  onDelete,
  pageTitle,
  submitButtonText,
}: BookFormProps) {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold mb-8">{pageTitle}</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">{book.title}</h2>
        <div className="flex gap-6">
          <Image
            src={book.thumbnail || "/placeholder.svg"}
            alt={book.title}
            className="w-32 h-48 object-cover"
            width={128}
            height={192}
          />
          <div className="space-y-2">
            <p className="text-gray-600">{book.authors?.join(", ") || "-"}</p>
            <p className="text-gray-600">
              {book.price === "-" ? book.price : `${book.price}円`}
            </p>
            <p className="text-gray-600">{book.publisher}</p>
            <p className="text-gray-600">{book.publishedDate}</p>
          </div>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            読書状況
          </label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger id="status">
              <SelectValue placeholder="状況を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="読書中">読書中</SelectItem>
              <SelectItem value="読了">読了</SelectItem>
              <SelectItem value="読みたい">読みたい</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700"
          >
            評価 (5段階評価)
          </label>
          <Select value={rating} onValueChange={onRatingChange}>
            <SelectTrigger id="rating">
              <SelectValue placeholder="評価を選択" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            htmlFor="review"
            className="block text-sm font-medium text-gray-700"
          >
            レビュー
          </label>
          <Textarea
            id="review"
            value={review}
            onChange={onReviewChange}
            placeholder="ここにレビューを書いてください..."
            rows={4}
          />
        </div>
        <div className="flex justify-between">
          <Button type="submit">{submitButtonText}</Button>
          {onDelete && (
            <Button type="button" variant="destructive" onClick={onDelete}>
              削除
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
