// 'use strict';
//
// const express = require('express');
//
// // eslint-disable-next-line new-cap
// const router = express.Router();
//
// // YOUR CODE HERE
//
// router.get('/', function(req, res) {
//   db.getAllPosts().then(posts => {
//     res.render('posts/posts', {
//       posts: posts,
//       title: 'An Excellent Blog'
//     })
//   })
// })
//
// router.get('/new', function(req, res) {
//   db.getAllUsers().then(users => {
//     res.render('posts/new', {
//       users: users,
//       title: 'An Excellent Blog'
//     })
//   })
// })
//
// router.get('/:id', function(req, res) {
//   db.getPost(req.params.id).then(post => {
//     res.render('posts/post', {
//       post: post,
//       title: 'An Excellent Blog'
//     })
//   })
// })
//
// router.post('/', function(req, res) {
//   db.createPost(req.body).then(() => {
//     res.redirect('/posts')
//   });
// });
//
// router.put('/:id', function(req, res) {
//   console.log(req.body)
//   db.updatePost(req.body).then(() => {
//     res.json({
//       'response': 'post updated'
//     })
//   });
// });
//
// router.delete('/:id', function(req, res) {
//   db.deletePost(req.params.id).then(() => {
//     res.json({
//       'response': 'post deleted'
//     })
//   });
// });
//
// router.get('/:id/edit', function(req, res) {
//   db.getPost(req.params.id).then(post => {
//     res.render('posts/edit', {
//       post: post,
//       title: 'An Excellent Blog'
//     })
//   });
// });
// module.exports = router;

//===============================
'use strict';

const boom = require('boom');
const express = require('express');
const knex = require('../knex');
const {
  camelizeKeys,
  decamelizeKeys
} = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((rows) => {
      const books = camelizeKeys(rows);

      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  knex('books')
    .where('id', id)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found');
      }

      const book = camelizeKeys(row);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  const {
    title,
    author,
    genre,
    description,
    coverUrl
  } = req.body;

  if (!title || !title.trim()) {
    return next(boom.create(400, 'Title must not be blank'));
  }

  if (!author || !author.trim()) {
    return next(boom.create(400, 'Author must not be blank'));
  }

  if (!genre || !genre.trim()) {
    return next(boom.create(400, 'Genre must not be blank'));
  }

  if (!description || !description.trim()) {
    return next(boom.create(400, 'Description must not be blank'));
  }

  if (!coverUrl || !coverUrl.trim()) {
    return next(boom.create(400, 'Cover URL must not be blank'));
  }

  const insertBook = {
    title,
    author,
    genre,
    description,
    coverUrl
  };

  knex('books')
    .insert(decamelizeKeys(insertBook), '*')
    .then((rows) => {
      const book = camelizeKeys(rows[0]);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  knex('books')
    .where('id', id)
    .first()
    .then((book) => {
      if (!book) {
        throw boom.create(404, 'Not Found');
      }

      const {
        title,
        author,
        genre,
        description,
        coverUrl
      } = req.body;
      const updateBook = {};

      if (title) {
        updateBook.title = title;
      }

      if (author) {
        updateBook.author = author;
      }

      if (genre) {
        updateBook.genre = genre;
      }

      if (description) {
        updateBook.description = description;
      }

      if (coverUrl) {
        updateBook.coverUrl = coverUrl;
      }

      return knex('books')
        .update(decamelizeKeys(updateBook), '*')
        .where('id', id);
    })
    .then((rows) => {
      const book = camelizeKeys(rows[0]);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/books/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  let book;

  knex('books')
    .where('id', id)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found');
      }

      book = camelizeKeys(row);

      return knex('books')
        .del()
        .where('id', id);
    })
    .then(() => {
      delete book.id;

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
