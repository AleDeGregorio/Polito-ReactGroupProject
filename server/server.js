'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult, body } = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB
const dayjs = require('dayjs')
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const cors = require('cors');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the users in the DB

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// init express
const app = express();
const PORT = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions)); // NB: Usare solo per sviluppo e per l'esame! Altrimenti indicare dominio e porta corretti


// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

//API's

// GET /api/films
app.get('/api/films', isLoggedIn, (req, res) => {
  dao.listFilms(req.user.id)
    .then(films => res.json(films))
    .catch(() => res.status(500).end());
});


// GET /api/films/<id>
app.get('/api/films/:id', isLoggedIn, async (req, res) => {
  try {
    const result = await dao.getFilm(req.params.id);
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

// GET /api/filterfilms/<filter>
app.get('/api/filterfilms/:filter', isLoggedIn, async (req, res) => {
  try {
    const result = await dao.getFilteredFilm(req.params.filter, req.user.id);
    if (result.error)
      res.status(404).json({ result: result, status: 404 });
    else
      res.json(result);
  } catch (err) {
    res.status(500).json({ error: 500 })
  }

})

// POST /api/film
app.post('/api/film', isLoggedIn, [
  check('title', 'insert a title').notEmpty(),
  check('rating', 'insert a rating between 0 and 5').isInt({ min: 0, max: 5 }),
  check('date')
    .custom((value, { req }) => {
      if (value === undefined || value === "") {
        return true;
      }
      if (!dayjs(value, "YYYY-MM-DD").isValid()) {
        throw new Error('Insert a valid date');
      }
      if (!dayjs().isAfter(dayjs(value))) {
        throw new Error('The insered date is in the future');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const film = {
    title: req.body.title,
    favorite: req.body.favorite,
    date: req.body.date,
    rating: req.body.rating
  };

  try {
    await dao.createFilm(film, req.user.id);
    res.status(201).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the creation of film` });
  }
});

// PUT /api/filmUpdate/
app.put('/api/filmUpdate/', isLoggedIn, [
  check('title', 'insert a title').notEmpty(),
  check('rating', 'insert a rating between 0 and 5').isInt({ min: 0, max: 5 }),
  check('date')
    .custom((value, { req }) => {
      if (value === undefined || value === "") {
        return true;
      }
      if (!dayjs(value, "YYYY-MM-DD").isValid()) {
        throw new Error('Insert a valid date');
      }
      if (!dayjs().isAfter(dayjs(value))) {
        throw new Error('The insered date is in the future');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const film = req.body;

  // you can also check here if the code passed in the URL matches with the code in req.body
  try {
    await dao.updateFilm(film, req.user.id);
    res.status(200).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the update of film ${req.body.id}.` });
  }

});


// DELETE /api/deleteFilm/
app.delete('/api/deleteFilm', isLoggedIn, async (req, res) => {
  try {
    await dao.deleteExam(req.body.id, req.user.id);
    res.status(204).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the deletion of film ${req.params.id}.` });
  }
});

//MARK /api/markfavorite
app.post('/api/markfavorite', isLoggedIn, [
  body('fav').isInt()
    .custom((value, { req }) => {
      if (value != 0 && value != 1) {
        throw new Error('fav must be 0 or 1');

      }

      // Indicates the success of this synchronous custom validator
      return true;
    }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    await dao.markFavorite(req.body.id, req.body.fav, req.user.id);
    res.status(200).end();
  } catch (err) {
    res.status(404).json({ error: 'Bad Request' });
  }
})
/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => { res.end(); });
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});

// Activate the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
