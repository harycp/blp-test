const mongoose = require("mongoose");
const { Schema } = mongoose;

const book = require("./models/books");

mongoose
  .connect("mongodb://127.0.0.1/auth_demo")
  .then((res) => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log("Error connecting to database");
  });

const bookData = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    pages: 324,
    genre: "fiction",
    year: 1960,
    language: "English",
  },
  {
    title: "1984",
    author: "George Orwell",
    pages: 328,
    genre: "fiction",
    year: 1949,
    language: "English",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    pages: 197,
    genre: "fiction",
    year: 1988,
    language: "Portuguese",
  },
  {
    title: "The Power of Habit",
    author: "Charles Duhigg",
    pages: 371,
    genre: "non-fiction",
    year: 2012,
    language: "English",
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    pages: 498,
    genre: "non-fiction",
    year: 2014,
    language: "Hebrew",
  },
  {
    title: "The Girl on the Train",
    author: "Paula Hawkins",
    pages: 323,
    genre: "thriller",
    year: 2015,
    language: "English",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    pages: 279,
    genre: "romance",
    year: 1813,
    language: "English",
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    pages: 371,
    genre: "fiction",
    year: 2003,
    language: "English",
  },
  {
    title: "Guns, Germs, and Steel",
    author: "Jared Diamond",
    pages: 498,
    genre: "history",
    year: 1997,
    language: "English",
  },
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    pages: 224,
    genre: "philosophy",
    year: 170,
    language: "Greek",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    pages: 214,
    genre: "fiction",
    year: 1951,
    language: "English",
  },
  {
    title: "The Hunger Games",
    author: "Suzanne Collins",
    pages: 374,
    genre: "fiction",
    year: 2008,
    language: "English",
  },
  {
    title: "The Tipping Point",
    author: "Malcolm Gladwell",
    pages: 301,
    genre: "non-fiction",
    year: 2000,
    language: "English",
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    pages: 454,
    genre: "thriller",
    year: 2003,
    language: "English",
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    pages: 552,
    genre: "fiction",
    year: 2005,
    language: "English",
  },
];

book
  .insertMany(bookData)
  .then((res) => {
    console.log("Data inserted");
  })
  .catch((err) => {
    console.log(err);
  });
