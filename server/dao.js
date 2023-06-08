'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');


// open the database
const db = new sqlite.Database('films.db', (err) => {
  if (err) throw err;
});


exports.listFilms = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE user = ?';
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const films = rows.map((e) => ({ id: e.id, title: e.title, favorite: e.favorite, date: e.watchdate, rating: e.rating }));
      resolve(films);
    });
  });
};

//get all the film by a filter
exports.getFilteredFilm = (filter, userId) => {
  return new Promise((resolve, reject) => {
    let sql = '';
    let error = false;
    switch (filter) {
      case 'all':
        sql = 'select * from films where user = ?';
        break;
      case 'favorite':
        sql = 'select * from films where favorite=1 and user = ?';
        break;
      case 'bestRated':
        sql = 'select * from films where rating=5 and user = ?';
        break;
      case 'unseen':
        sql = 'select * from films where watchdate is NULL and user = ?';
        break;
      case 'seenLastMonth':
        sql = 'select * from films where watchdate between date("now","-1 month") and date("now") and user = ?';
        break;

      default:
        error = true;
        break;
    }

    if (error) {
      resolve({error: "filtro non supportato"});
    }
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const films = rows.map((e) => ({ id: e.id, title: e.title, favorite: e.favorite, date: e.watchdate, rating: e.rating }));
      resolve(films);
    });
  });
};




//get the film by the id

exports.getFilm = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Film not found.' });
      } else {
        resolve(row);
      }
    });
  });
};

//create a new film
exports.createFilm = (film, userId) => {
  return new Promise(async (resolve, reject) => {
    let id = 0;
    const qId = await queryId().then((maxId) => id = maxId + 1);
    const sql = 'INSERT INTO films(id,title,favorite, watchdate, rating, user) VALUES(?,?,?, DATE(?), ?, ?)';
    db.run(sql, [id, film.title, film.favorite, film.date, film.rating, userId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// update an existing film
exports.updateFilm = (film, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE films SET title=?,favorite=?, watchdate=DATE(?), rating=? WHERE id = ? AND user = ?';
    db.run(sql, [film.title, film.favorite, film.date, film.rating, film.id, userId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};
// delete an existing film
exports.deleteExam = (id, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM films WHERE id = ? AND user = ?';
    db.run(sql, [id, userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}

//mark favourite
exports.markFavorite = (id, fav, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE films SET favorite=? where id = ? and user = ?';
    db.run(sql, [fav, id, userId], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}

const queryId = () => {

  return new Promise((resolve, reject) => {
    const sql = 'SELECT max(id) as maxId FROM films';
    db.all(sql, [], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row[0].maxId);
    });
  });
}