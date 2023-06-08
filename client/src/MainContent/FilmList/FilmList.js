import { Col, Table, Form } from 'react-bootstrap'
import { PlusCircle, StarFill, Star, Trash, Pencil } from 'react-bootstrap-icons'
import dayjs from "dayjs";
import './filmList.css'
import { useNavigate } from 'react-router-dom';
import API from '../../API';

var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);



function RenderFilms(props) {
    const { setDirty, films, setFavorite, setRating, setFilmEdit } = props;

    const navigate = useNavigate();

    const deleteFilm = (film) => {
        API.deleteFilm(film.id).then((res) => {
            if (res)
                setDirty(true);
        })
    }

    const editFilm = (film) => {
        setFilmEdit(film);
        navigate('/edit');
    }

    const listFilms = films.map((film) => {

        let i = 0;
        let renderRating = [];

        for (i; i < film.rating ? film.rating : 0; i++)
            renderRating.push(<StarFill key={i} />);

        if (i < 5) {

            for (i; i < 5; i++)
                renderRating.push(<Star key={i} />);
        }

        return (
            <tr key={film.id}>
                <td><Pencil onClick={() => editFilm(film)} /></td>
                <td><span style={{ color: film.favorite ? "red" : "black", fontWeight: "normal" }}>{film.title}</span></td>
                <td>
                    <div className="form-check">
                        <Form.Check type='checkbox' checked={film.favorite} onChange={() => setFavorite(film)} name={"film" + film.id} id={`film${film.id}`} label='Favorite' />
                    </div>
                </td>
                <td>{film.date ? dayjs(film.date, "YYYY-MM-DD").format("MMMM DD, YYYY") : ""}</td>
                <td>
                    {
                        renderRating.map((rating, index) => <span key={index} onClick={() => setRating(index + 1, film)}>{rating}</span>)
                    }
                </td>
                <td><Trash className='trashIcon' onClick={() => deleteFilm(film)} /></td>
            </tr>
        );
    });

    return (<>{listFilms}</>);
}

function FilmList(props) {
    const { setDirty, filmList, currentFilter, setFavorite, setRating, setFilmEdit } = props;

    const navigate = useNavigate();

    const filterLabel = () => {
        let label = "";

        switch (currentFilter) {
            case "all":
                label = "All";
                break;
            case "favorite":
                label = "Favorites";
                break;
            case "bestRated":
                label = "Best rated";
                break;
            case "seenLastMonth":
                label = "Seen last month";
                break;
            case "unseen":
                label = "Unseen";
                break;
            default:
                label = "All";
                break;
        }
        return label;
    }

    return (
        <Col lg={9}>
            <h1 id="active-filter">{filterLabel()}</h1>
            <Table hover>
                <tbody id="main">
                    <RenderFilms setDirty={setDirty} films={filmList} setFavorite={setFavorite} setRating={setRating} setFilmEdit={setFilmEdit} />
                </tbody>
            </Table>
            <div className="d-flex flex-row-reverse bd-highlight">
                <PlusCircle className='addFilmIcon' onClick={() => navigate('/add')} />
            </div>
        </Col>
    )
}

export default FilmList;