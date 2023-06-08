import { Col, ListGroup, ListGroupItem } from 'react-bootstrap'

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import './filters.css'

function Filters(props) {
    const { filter } = useParams();
    const { currentFilter, setCurrentFilter} = props;
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentFilter(filter ? filter : "all");
    }, [filter]);

    return (

        <Col lg={3}>
            <ListGroup>
                <ListGroupItem active={currentFilter === "all" ? true : false} action onClick={() => navigate("/")}>All</ListGroupItem>
                <ListGroupItem active={currentFilter === "favorite" ? true : false} action onClick={() => navigate("/favorite")}>Favorites</ListGroupItem>
                <ListGroupItem active={currentFilter === "bestRated" ? true : false} action onClick={() => navigate("/bestRated")}>Best rated</ListGroupItem>
                <ListGroupItem active={currentFilter === "seenLastMonth" ? true : false} action onClick={() => navigate("/seenLastMonth")}>Seen last month</ListGroupItem>
                <ListGroupItem active={currentFilter === "unseen" ? true : false} action onClick={() => navigate("/unseen")}>Unseen</ListGroupItem>
            </ListGroup>
        </Col>
    )
}

export default Filters;