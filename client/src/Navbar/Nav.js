import { Navbar, Container, Button } from 'react-bootstrap'
import { CollectionPlay, PersonCircle } from 'react-bootstrap-icons'

import './nav.css'

function Nav(props) {

    const user = props.user;
    const logOut = props.logOut;

    return (
        <Navbar bg='primary'>
            <Container fluid>

                <div className='p-2 bd-highlight'>
                    <span className='head-text'><CollectionPlay className='playIcon'/> Film Library</span>
                </div>

                <div className='p-2 bd-highlight'>
                    <form className='d-flex'>
                        <input className='form-control me-2' type='search' placeholder='Search' aria-label='Search'></input>
                    </form>
                </div>

                <div className='p-2 bd-highlight'><PersonCircle className='personIcon'/>
                    <p style={{color: 'white'}}> Hello {user.name}</p>
                </div>

                <Button variant="danger" onClick={logOut}>Logout</Button>
            </Container>
        </Navbar>
    )
}

export default Nav;