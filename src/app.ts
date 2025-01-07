import express, { Request, Response } from "express";

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  available: boolean;
}

const books: Book[] = [];
var newId: number = 0;

const app = express();

// Middleware for parsing JSON data
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/books", (req: Request, res: Response) => {
  res.json(books);
});

app.post("/books", (req: Request, res: Response) => {
  const newBook: Book = req.body;
  if (!newBook.title || !newBook.author || typeof newBook.year !== "number" || typeof newBook.available !== "boolean") {
    return res.status(400).json({ message: "Invalid data" });
  }
  newBook.id = newId;
  newId += 1;
  books.push(newBook);
  res.json(books);
});

app.get("/books/:id", (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const book: Book | undefined = books.find((book) => book.id === id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

app.put("/books/:id", (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const book: Book | undefined = books.find((book) => book.id === id);
  if (book) {
    const updatedBook: Book = req.body;
    if (!updatedBook.title || !updatedBook.author || typeof updatedBook.year !== "number" || typeof updatedBook.available !== 'boolean') {
      return res.status(400).json({ message: "Invalid data" });
    }
    const index: number = books.findIndex((book) => book.id === id);
    books[index] = updatedBook;
    books[index].id = id;
    res.json(updatedBook);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

app.delete("/books/:id", (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const index: number = books.findIndex((book) => book.id === id);
  if (index >= 0) {
    books.splice(index, 1);
    res.send("Book deleted");
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Start the server
const PORT: number = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
