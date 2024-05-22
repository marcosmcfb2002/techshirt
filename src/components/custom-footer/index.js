import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function CustomFooter() {
    return (
        <footer style={{ backgroundColor: '#d2e4e1', padding: '20px 0' }}>
            <Container>
                <Row>
                    <Col md={4}>
                        <h5 style={{ color: '#207869' }}>Techshirt</h5>
                        <ul className="list-unstyled" style={{ color: '#207869' }}>
                            <li><a href="#" style={{ color: '#207869' }}>Sobre nós</a></li>
                            <li><a href="#" style={{ color: '#207869' }}>Serviços</a></li>
                            <li><a href="#" style={{ color: '#207869' }}>Contato</a></li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h5 style={{ color: '#207869' }}>Suporte</h5>
                        <ul className="list-unstyled" style={{ color: '#207869' }}>
                            <li><a href="#faq" style={{ color: '#207869' }}>FAQ</a></li>
                            <li><a href="#help" style={{ color: '#207869' }}>Central de ajuda</a></li>
                            <li><a href="#terms" style={{ color: '#207869' }}>Termos de serviço</a></li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h5 style={{ color: '#207869' }}>Redes sociais</h5>
                        <ul className="list-unstyled" style={{ color: '#207869' }}>
                            <li><a href="#facebook" style={{ color: '#207869' }}>Facebook</a></li>
                            <li><a href="#twitter" style={{ color: '#207869' }}>X | Twitter</a></li>
                            <li><a href="#instagram" style={{ color: '#207869' }}>Instagram</a></li>
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center" style={{ color: '#207869', marginTop: '20px' }}>
                        &copy; {new Date().getFullYear()} Techshirt. Todos os diretios reservados.
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default CustomFooter;
