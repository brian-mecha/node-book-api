const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const books = [
  {bookId: 1, title: 'Intro to Node'},
  {bookId: 2, title: 'Intermediate Node tutorial'},
  {bookId: 3, title: 'Expert Node tutorial'}
];

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.get('/api/books', (req, res) => {
  res.send(books);
})

app.post('/api/books', (req, res) => {
  const { error } = bookValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const book = {
    bookId: books.length +1,
    title: req.body.title
  };
  books.push(book);
  res.send(book);
})

app.get('/api/book/:bookId', (req, res) => {
  const book = books.find(b => b.bookId === parseInt(req.params.bookId));
  if (!book) return res.status(404).send('Book not found');
  res.send(book);
})

app.put('/api/book/:bookId', (req, res) => {
  const book = books.find(b => b.bookId === parseInt(req.params.bookId));
  if (!book) return res.status(404).send('Book not found');

  const { error } = bookValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  book.title = req.body.title;
  res.send(book);
});

app.delete('/api/book/:bookId', (req, res) => {
  const book = books.find(b => b.bookId === parseInt(req.params.bookId));
  if (!book) return res.status(404).send('Book not found');

  const index = books.indexOf(book);
  books.splice(index, 1);

  res.send(`Book with title ${book.title} has been deleted successfully.`)
});

function bookValidation(book) {
  const schema = {
    title: Joi.string().min(3).required()
  };

  return Joi.validate(book, schema);
};

app.listen(3001, () => console.log('Listening on port 3001...'));
