import { Container, Row } from 'react-bootstrap'

import './containerMain.css'

import FilmList from './FilmList/FilmList';
import dayjs, { isDayjs } from "dayjs";
import { Outlet } from 'react-router-dom';
import API from '../API';

var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

function ContainerMain(props) {
    const { setDirty, setFilmList, currentFilmList, currentFilter, filmEdit, setFilmEdit } = props;

    const setFavorite = (film) => {

        const updFilm = {
            id: film.id,
            favorite: film.favorite ? 0 : 1
        }

        API.markFavorite(updFilm).then((res) => {
            if (res)
                setDirty(true);
        })
    }

    const setRating = (newRating, film) => {

        if (newRating != film.rating) {
            const updFilm = {
                id: film.id,
                title: film.title,
                favorite: film.favorite,
                date: isDayjs(film.date) ? film.date.format('YYYY-MM-DD') : "",
                rating: newRating
            }

            API.updateFilm(updFilm).then((res) => {
                if (res)
                    setDirty(true);
            })
        }
    }

    return (
        <Container fluid className='containerMain'>
            <Row>
                <Outlet />
                <FilmList filmList={currentFilmList} currentFilter={currentFilter}
                    setFavorite={setFavorite} setFilmList={setFilmList} setRating={setRating}
                    filmEdit={filmEdit} setFilmEdit={setFilmEdit} setDirty={setDirty}
                />
            </Row>
        </Container>
    )
}

export default ContainerMain;