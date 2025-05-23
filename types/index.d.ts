type RecordedBook = {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  price: string;
  publisher: string;
  publishedDate: string;
  status: string;
  rating: string;
  review: string;
  createdAt: string;
};

type SearchResult = {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  price: string;
  publishedDate: string;
  publisher: string;
};

type GoogleBookItem = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
    publishedDate?: string;
    publisher?: string;
  };
  saleInfo: {
    listPrice: {
      amount?: string;
    };
  };
};