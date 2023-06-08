import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';

function LoginForm(props) {
  const [username, setUsername] = useState('testuser@polito.it');
  const [password, setPassword] = useState('password');
  const [emptyMessage, setEmptyMessage] = useState('');
  
  const error = props.error;
  const message = props.message;
  const setErrorLogin = props.setErrorLogin;

  function validaEmail(email) {
    var regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regexp.test(email);
  }
  
  const handleSubmit = (event) => {
      event.preventDefault();
      setEmptyMessage('');
      setErrorLogin(false);
      const credentials = { username, password };
      
      let valid = true;
      if(username === '' || password === '')
          valid = false;

      if (username !== "" && !validaEmail(username)) {
        valid = false;
      }
      
      if(valid)
      {
        props.login(credentials);
      }
      else {
        setEmptyMessage('Error(s) in the form, please fix it.')
      }
  };

  return (
      <Container>
          <Row>
              <Col>
                  <h2>Login</h2>
                  <Form>
                      {error && <Alert variant='danger'>{message}</Alert>}
                      {emptyMessage && <Alert variant='danger'>{emptyMessage}</Alert>}
                      <Form.Group controlId='username'>
                          <Form.Label>email</Form.Label>
                          <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
                      </Form.Group>
                      <Form.Group controlId='password'>
                          <Form.Label>Password</Form.Label>
                          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                      </Form.Group>
                      <Button onClick={handleSubmit}>Login</Button>
                  </Form>
              </Col>
          </Row>
      </Container>
    )
}

export { LoginForm };