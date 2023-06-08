# BigLab 2 - Class: 2022 AW1

## Team name: Kave

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://polito-wa1-aw1-2022.github.io/materials/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://polito-wa1-aw1-2022.github.io/materials/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once you cloned this repository, please write the group name and names of the members of the group in the above section.

In the `client` directory, do **NOT** create a new folder for the project, i.e., `client` should directly contain the `public` and `src` folders and the `package.json` files coming from BigLab1.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but please double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.
Remember that `npm install` should be executed inside the `client` and `server` folders (not in the `BigLab2` root directory).

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## Registered Users

Here you can find a list of the users already registered inside the provided database. This information will be used during the fourth week, when you will have to deal with authentication.
If you decide to add additional users, please remember to add them to this table (with **plain-text password**)!

| email | password | name |
|-------|----------|------|
| john.doe@polito.it | password | John |
| mario.rossi@polito.it | password | Mario |
| testuser@polito.it | password | Giovanni |

## List of APIs offered by the server

Provide a short description of the API you designed, with the required parameters. Please follow the proposed structure.

* [HTTP Method] [URL, with any parameter]
* [One-line about what this API is doing]
* [A (small) sample request, with body (if any)]
* [A (small) sample response, with body (if any)]
* [Error responses, if any]

Hereafter, we report the designed HTTP APIs, also implemented in the project.

### __List films__

URL: `/api/films`

Method: GET

Description: Get all the films that are stored in the database.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a film.
```
[{
    "id": 1,
    "title": "Pulp Fiction",
    "favorite": 1,
    "watchdate": 2022-03-11,
    "rating": 5,
    "user": 1
}, {
    "id": 2,
    "title": "21 Grams",
    "favorite": 1,
    "watchdate": 2022-03-17,
    "rating": 4,
    "user": 1
},
...
]
```

### __Get film by id__

URL: `/api/films/<id>`

Method: GET

Description: Get the film identified by the id `<id>`.

Request body: _None_

Response: `200 OK` (success), `404 Not Found` (wrong id) or `500 Internal Server Error` (generic error).

Response body: An object, describing a specific film.
```
[{
    "id": 1,
    "title": "Pulp Fiction",
    "favorite": 1,
    "watchdate": 2022-03-11,
    "rating": 5,
    "user": 1
}
]
```

### __Filter films__

URL: `/api/filterfilms/<filter>`

Method: GET

Description: Get all the films that fulfill the filter `<filter>`. Available filters are _all_, _favorite_, 
_bestRated_, _unseen_, _seenLastMonth_

Request body: _None_

Response: `200 OK` (success), `404 Not Found` (wrong filter) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a film.
```
[{
    "id": 1,
    "title": "Pulp Fiction",
    "favorite": 1,
    "watchdate": 2022-03-11,
    "rating": 5,
    "user": 1
}, {
    "id": 2,
    "title": "21 Grams",
    "favorite": 1,
    "watchdate": 2022-03-17,
    "rating": 4,
    "user": 1
},
...
]
```

### __Add a new film__

URL: `/api/film/`

Method: POST

Description: Add a new film to the list of films.

Request body: An object representing a film (Content-Type: `application/json`).
```
{
    "title": "Pulp Fiction",
    "favorite": 1,
    "date": 2022-03-11,
    "rating": 5
}
```

Response: `201 Created` (success) or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: _None_

### __Update a film__

URL: `/api/filmUpdate`

Method: PUT

Description: Update an existing film, identified by its id.

Request body: An object representing a film (Content-Type: `application/json`).
```
{
    "id": 1,
    "title": "Pulp Fiction",
    "favorite": 1,
    "date": 2022-03-11,
    "rating": 5
}
```

Response: `200 OK` (success) or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: _None_

### __Delete a film__

URL: `/api/deleteFilm/`

Method: DELETE

Description: Delete an existing film, identified by its id.

Request body: An object representing the id of the film (Content-Type: `application/json`).
```
{
    "id": 1
}
```

Response: `204 No Content` (success) or `503 Service Unavailable` (generic error).

Response body: _None_

### __Mark favorite__

URL: `/api/markfavorite`

Method: POST

Description: Mark an existing film, identified by its id, as favorite.

Request body: An object representing the id of the film and the value of the attribute "favorite" (Content-Type: `application/json`). Attribute "favorite" can have value 1 (favorite) or 0 (unfavorite)
```
{
    "id": 1,
    "fav": 1
}
```

Response: `200 OK` (success) or `404 Not Found` (wrong id). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: _None_

### __Login__

URL: `/api/sessions`

Method: POST

Description: Login a user.

Request body: An object representing the username and password of the user. (Content-Type: `application/json`).
```
{
    "username": "email@prova.it",
    "password": "password"
}
```

Response: `200 OK` (success) or `401 Not Found` (user not in db).

Response body:
```
{
    "id": 1,
    "username": "email@prova.it",
    "name": "Mario"
}
```

### __Logout__

URL: `/api/sessions/current`

Method: DELETE

Description: Logout a user.

Request body:  _None_

Response: _None_

Response body: _None_


### __Check user logged__

URL: `/api/sessions`

Method: GET

Description: Check if a user is already logged in.

Request body: _None_

Response: `200 OK` (success) or `404 Unauthenticated user` (user not authenticated).

Response body:
```
{
    "id": 1,
    "username": "email@prova.it",
    "name": "Mario"
}
```