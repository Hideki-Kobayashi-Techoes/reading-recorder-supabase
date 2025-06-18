# 新しいデータベース設計

このドキュメントでは、読書記録アプリケーションの新しいデータベース設計について説明します。

## テーブル構造

### books テーブル

本の基本情報を保存するテーブルです。ユーザー間で共有されます。

```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_book_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  publisher TEXT,
  published_date TEXT,
  thumbnail TEXT,
  price TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_books_google_book_id ON books(google_book_id);
```

### book_authors テーブル

本と著者の関連を保存するテーブルです。

```sql
CREATE TABLE book_authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id),
  author_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_book_authors_book_id ON book_authors(book_id);
```

### reading_records テーブル

ユーザーの読書記録を保存するテーブルです。

```sql
CREATE TABLE reading_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  book_id UUID NOT NULL REFERENCES books(id),
  status TEXT NOT NULL,
  rating INTEGER NOT NULL,
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_book UNIQUE(user_id, book_id)
);

-- インデックス
CREATE INDEX idx_reading_records_user_id ON reading_records(user_id);
CREATE INDEX idx_reading_records_book_id ON reading_records(book_id);
CREATE INDEX idx_reading_records_user_book ON reading_records(user_id, book_id);
```

## 自動更新トリガー

各テーブルの `updated_at` フィールドを自動更新するトリガーを設定します。

```sql
-- moddatetime 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS moddatetime;

-- books テーブルのトリガー
CREATE TRIGGER handle_books_updated_at
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE PROCEDURE moddatetime (updated_at);

-- book_authors テーブルのトリガー
CREATE TRIGGER handle_book_authors_updated_at
BEFORE UPDATE ON book_authors
FOR EACH ROW
EXECUTE PROCEDURE moddatetime (updated_at);

-- reading_records テーブルのトリガー
CREATE TRIGGER handle_reading_records_updated_at
BEFORE UPDATE ON reading_records
FOR EACH ROW
EXECUTE PROCEDURE moddatetime (updated_at);
```

## ビュー

読書記録と本の情報を結合したビューを作成します。

```sql
CREATE OR REPLACE VIEW reading_records_with_books AS
SELECT 
  rr.id,
  rr.user_id,
  rr.book_id,
  rr.status,
  rr.rating,
  rr.review,
  rr.created_at,
  rr.updated_at,
  b.google_book_id,
  b.title,
  b.publisher,
  b.published_date,
  b.thumbnail,
  b.price,
  ARRAY_AGG(ba.author_name) AS authors
FROM 
  reading_records rr
JOIN 
  books b ON rr.book_id = b.id
LEFT JOIN 
  book_authors ba ON b.id = ba.book_id
GROUP BY 
  rr.id, b.id;
```

## データベース関数

### 本と著者を同時に作成する関数

本と著者情報を同時に作成するためのトランザクション関数です。この関数を使用することで、本の作成と著者情報の追加が原子的に行われ、データの整合性が保たれます。

```sql
CREATE OR REPLACE FUNCTION create_book_with_authors(
  p_google_book_id TEXT,
  p_title TEXT,
  p_publisher TEXT,
  p_published_date TEXT,
  p_thumbnail TEXT,
  p_price TEXT,
  p_authors TEXT[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_book_id UUID;
BEGIN
  -- 本を挿入
  INSERT INTO books(google_book_id, title, publisher, published_date, thumbnail, price)
  VALUES(p_google_book_id, p_title, p_publisher, p_published_date, p_thumbnail, p_price)
  RETURNING id INTO v_book_id;
  
  -- 著者を挿入
  INSERT INTO book_authors(book_id, author_name)
  SELECT v_book_id, unnest(p_authors);
  
  -- 成功した場合、本のIDを返す
  RETURN v_book_id;
END;
$$;
```

## 行レベルセキュリティ（RLS）ポリシー

各テーブルにRLSポリシーを設定して、ユーザーが自分のデータのみにアクセスできるようにします。

```sql
-- RLSの有効化
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_records ENABLE ROW LEVEL SECURITY;

-- books テーブルのポリシー
CREATE POLICY "Anyone can view books"
  ON books FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert books"
  ON books FOR INSERT
  WITH CHECK (true);

-- book_authors テーブルのポリシー
CREATE POLICY "Anyone can view book authors"
  ON book_authors FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert book authors"
  ON book_authors FOR INSERT
  WITH CHECK (true);

-- reading_records テーブルのポリシー
CREATE POLICY "Users can view their own reading records"
  ON reading_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading records"
  ON reading_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading records"
  ON reading_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading records"
  ON reading_records FOR DELETE
  USING (auth.uid() = user_id);
```
