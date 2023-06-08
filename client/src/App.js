import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import dayjs from "dayjs";
import { Alert } from 'react-bootstrap';
import { LoginForm } from './LoginComponents'
import Nav from './Navbar/Nav';
import Filter from './MainContent/Filters/Filters';
import ContainerMain from './MainContent/ContainerMain';
import CustomForm from './MainContent/CustomForm/CustomForm';
import API from './API';

var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

function AlertDismissibleExample(props) {
  const { show, setShow, error } = props;

  const getMessage = () => {
    if (error.status == 404)
      return error.result.error;
    else
      return "Si è verificato un errore"
  }

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Errore</Alert.Heading>
        <p>
          {getMessage()}
        </p>
      </Alert>
    );
  }
}
function App() {
  return (
    <Router>
      <App2 />
    </Router>
  )
}

function App2() {
  const [filmList, setFilmList] = useState([]);
  const [currentFilmList, setCurrentFilmList] = useState([]);
  const [filmEdit, setFilmEdit] = useState({});
  const [currentFilter, setCurrentFilter] = useState("");
  const [dirty, setDirty] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);  // no user is logged in when app loads
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [errorLogin ,setErrorLogin] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        setError(err);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      if (currentFilter !== "") {
        if (currentFilter === "all") {
          API.films()
            .then((films) => { setFilmList(films); setCurrentFilmList(films); })
            .catch(err => { setError(err); setShow(true) })
        }
        else {
          API.filters(currentFilter)
            .then((films) => {
              setFilmList(films); setCurrentFilmList(films);
            })
            .catch(err => { setError(err); setShow(true); })
        }
      }
    }
  }, [currentFilter, loggedIn])

  useEffect(() => {
    if (dirty) {
      API.films()
        .then((films) => {
          setFilmList(films);
          setCurrentFilmList(films);
          setDirty(false);
        })
        .catch(err => { setError(err); setShow(true) })
    }
  }, [dirty])

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setErrorLogin(false);
        setMessage('');
        navigate('/');
      })
      .catch(err => {
        setErrorLogin(true);
        setMessage(err);
      }
      )
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    setFilmList([]);
    setCurrentFilmList([]);
  }

  return (
    <>
      <AlertDismissibleExample show={show} setShow={setShow} error={error} />
      {loggedIn && <Nav user={user} logOut={doLogOut}/>}
      <Routes>
        <Route path='/' element={
          loggedIn ? (
            <ContainerMain setFilmList={setFilmList}
              currentFilmList={currentFilmList} setCurrentFilmList={setCurrentFilmList}
              filmEdit={filmEdit} setFilmEdit={setFilmEdit}
              currentFilter={currentFilter}
              setDirty={setDirty}
            />) : <Navigate to='/login' />
        } >
          <Route index element={<Filter currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />} />
          <Route path=':filter' element={<Filter currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />} />
        </Route>
        <Route path='/login' element={loggedIn ? <Navigate to='/' /> : <LoginForm login={doLogIn} error={errorLogin} setErrorLogin={setErrorLogin} message={message}/>} />
        <Route path='/add' element={loggedIn ? <CustomForm setDirty={setDirty} filmEdit={filmEdit} setFilmEdit={setFilmEdit} /> : <Navigate to='/login' />} />
        <Route path='/edit' element={loggedIn ? <CustomForm setDirty={setDirty} filmEdit={filmEdit} setFilmEdit={setFilmEdit} /> : <Navigate to='/login' />} />
      </Routes>
    </>
  );
}

export default App;
