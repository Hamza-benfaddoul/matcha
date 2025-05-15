import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f8f9fa;
`;

const Title = styled.h1`
    font-size: 4rem;
    color: #343a40;
`;

const Message = styled.p`
    font-size: 1.5rem;
    color: #6c757d;
`;

const HomeLink = styled(Link)`
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1.2rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    text-decoration: none;

    &:hover {
        background-color: #0056b3;
    }
`;

const NotFoundPage: React.FC = () => {
    return (
        <Container>
            <Title>404 - Page Not Found</Title>
            <Message>Sorry, the page you are looking for does not exist.</Message>
            <HomeLink to="/">Go back to Home</HomeLink>
        </Container>
    );
};

export default NotFoundPage;