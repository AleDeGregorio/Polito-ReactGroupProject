const APIURL = new URL('http://localhost:3001/api/')

async function films() {
    const response = await fetch(new URL('films',APIURL),{credentials: 'include'});
    const films = await response.json();
    if (response.ok) {
        return films;
    } else {
        throw films;
    }
}

async function filters(filter) {
    const response = await fetch(new URL(('filterfilms/' + filter),APIURL),{credentials: 'include'})
    const films = await response.json();
    if (response.ok) {
        return films;
    } else {
        throw films;
    }
}

function addFilm(film) {
    return new Promise((resolve, reject) => {
        fetch(new URL('film', APIURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: film.title, favorite: film.favorite, date: film.date, rating: film.rating}),
        }).then((response) => {
            if (response.ok) {
                const ok = true;
                resolve(ok);
            } else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function updateFilm(film) {
    return new Promise((resolve, reject) => {
        fetch(new URL('filmUpdate', APIURL), {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: film.id, title: film.title, favorite: film.favorite, date: film.date, rating: film.rating }),
        }).then((response) => {
            if (response.ok) {
                const ok = true;
                resolve(ok);
            } else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function markFavorite(film) {
    return new Promise((resolve, reject) => {
        fetch(new URL('markfavorite', APIURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: film.id, fav: film.favorite }),
        }).then((response) => {
            if (response.ok) {
                const ok = true;
                resolve(ok);
            } else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function deleteFilm(id) {
    return new Promise((resolve, reject) => {
        fetch(new URL('deleteFilm', APIURL), {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        }).then((response) => {
            if (response.ok) {
                const ok = true;
                resolve(ok);
            } else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}
async function logIn(credentials) {
    let response = await fetch(new URL('sessions', APIURL), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }
  
  async function logOut() {
    await fetch(new URL('sessions/current', APIURL), { method: 'DELETE', credentials: 'include' });
  }
  
  async function getUserInfo() {
    const response = await fetch(new URL('sessions/current', APIURL), {credentials: 'include'});
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
}

const API = { films, filters, addFilm, updateFilm, markFavorite, deleteFilm, logIn, logOut, getUserInfo };
export default API;