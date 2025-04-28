// src/components/Navbar/Navbar.jsx
import React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Navbar.style.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <BootstrapNavbar bg="light" expand="lg" className="custom-navbar">
      <Container>
        <BootstrapNavbar.Brand onClick={() => navigate('/')} className="clickable">
            싱크테크노 과제 페이지
        </BootstrapNavbar.Brand>
        <Nav className="ms-auto">
          <Button variant="outline-primary" className="me-2" onClick={() => navigate('/')}>
            홈
          </Button>
          <Button variant="outline-success" className="me-2" onClick={() => navigate('/simulator')}>
            시뮬레이터
          </Button>
          <Button variant="outline-warning" onClick={() => navigate('/api-docs-viewer')}>
            API 문서
          </Button>
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
