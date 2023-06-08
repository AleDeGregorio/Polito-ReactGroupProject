import {Form, Button, Alert, Container} from "react-bootstrap";
import { useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom'
import API from "../../API";

function AlertDismissibleExample(props) {
  const {show, setShow} = props;

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Errore</Alert.Heading>
        <p>
          Campi inseriti non corretti
        </p>
      </Alert>
    );
  }
}

export default function CustomForm(props) {
  const { setDirty, filmEdit, setFilmEdit} = props;
  const [titolo, setTitolo] = useState(filmEdit.title || "");
  const [favorito, setFavorito] = useState(filmEdit.favorite || false);
  const [dataVisione, setDataVisione] = useState(filmEdit.date ? dayjs(filmEdit.date, "YYYY-MM-DD") : undefined);
  const [rating, setRating] = useState(filmEdit.rating || undefined);

  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    if (titolo === "") isValid = false;
    if (dataVisione && !dayjs().isAfter(dayjs(dataVisione))) {
      isValid = false
    }
    if (rating < 0 || rating > 5) isValid = false;
    if (isValid && !(Object.keys(filmEdit).length > 0)) {

      const newFilm = {
        title: titolo,
        favorite: favorito,
        date: dataVisione ? dataVisione.format('YYYY-MM-DD') : "",
        rating: rating > 0 ? rating : 0
      }

      API.addFilm(newFilm).then((res) => {
        if(res)
          setDirty(true);
      })

      navigate('/');
    }
    if(isValid && Object.keys(filmEdit).length > 0) {

      const updFilm = {
        id: filmEdit.id,
        title: titolo,
        favorite: favorito,
        date: dataVisione ? dataVisione.format('YYYY-MM-DD') : "",
        rating: rating > 0 ? rating : 0
      }

      API.updateFilm(updFilm).then((res) => {
        if(res)
          setDirty(true);
      })
      
      navigate('/');
    }
    else {
      setShow(true);
    }
  }

  return (
    <Container>
    <h1>{filmEdit.id ? "Modifica film" : "Inserimento film"}</h1>
    <AlertDismissibleExample show={show} setShow={setShow}/>
    <Form onSubmit={(e) => handleSubmit(e)}>
      <Form.Group className="mb-3">
        <Form.Label>Titolo</Form.Label>
        <Form.Control type="text" placeholder="Titolo film" onChange={(e) => setTitolo(e.target.value)} value={titolo}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Film favorito" onChange={(e) => setFavorito(e.target.checked)} checked={favorito}/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Control type="date" placeholder="data visione" onChange={(e) => setDataVisione(dayjs(e.target.value))} value={dataVisione?.format("YYYY-MM-DD") || ""}/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Control type="number" placeholder="rating" onChange={(e) => setRating(e.target.value)} value={rating || ""} min={0} max={5}/>
      </Form.Group>
      <Button variant="primary" type="submit" className="mx-1">
        Submit
      </Button>
      <Button variant="secondary" onClick={() => {navigate('/'); setFilmEdit({})} }>
        Cancel
      </Button>
    </Form>
    </Container>
  )
}