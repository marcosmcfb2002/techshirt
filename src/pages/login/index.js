// AuthPage.js
import React from 'react';
import { Form, InputGroup, Button, Container, Row, Col } from 'react-bootstrap';
import {FaEnvelope, FaFacebook, FaGoogle, FaLinkedin, FaLock, FaUser} from 'react-icons/fa';
import CustomButton from '../../components/custom-button';

function Login() {
    return (
        <Container fluid style={{ height: '100vh', display: 'flex' }}>
            <Row style={{ flex: 1 }}>
                <Col md={6} style={{ backgroundColor: '#16afa0', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h1 style={{fontWeight: "bolder", fontSize: "4rem"}} className={"mb-4"}>Login</h1>
                    <Form style={{width: '80%', maxWidth: '400px'}}>
                        <Form.Group controlId="formEmail" className="mb-3">
                            <InputGroup>
                                <InputGroup.Text><FaEnvelope/></InputGroup.Text>
                                <Form.Control type="email" placeholder="Email"/>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mb-4">
                            <InputGroup>
                                <InputGroup.Text><FaLock/></InputGroup.Text>
                                <Form.Control type="password" placeholder="Senha"/>
                            </InputGroup>
                        </Form.Group>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <CustomButton variant="light" type="submit" style={{fontWeight: "bold", color: "#16afa0",width: '60%'}}>
                                Entrar
                            </CustomButton>
                        </div>
                    </Form>
                </Col>
                <Col md={6} style={{
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h1 style={{color: "#16afa0", fontWeight: "bolder", fontSize: "3.5rem"}}>Criar Conta</h1>
                    <Row className="mb-4" style={{ justifyContent: 'center', width: '80%', maxWidth: '400px' }}>
                        <Col xs="auto">
                            <FaFacebook size={40} style={{ color: 'gray', cursor: 'pointer' }} />
                        </Col>
                        <Col xs="auto">
                            <FaGoogle size={40} style={{ color: 'gray', cursor: 'pointer' }} />
                        </Col>
                        <Col xs="auto">
                            <FaLinkedin size={40} style={{ color: 'gray', cursor: 'pointer' }} />
                        </Col>
                    </Row>
                    <Form style={{width: '80%', maxWidth: '400px'}}>
                        <Form.Group controlId="formName" className="mb-3">
                            <InputGroup>
                                <InputGroup.Text><FaUser/></InputGroup.Text>
                                <Form.Control type="text" placeholder="Nome"/>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mb-3">
                            <InputGroup>
                                <InputGroup.Text><FaEnvelope/></InputGroup.Text>
                                <Form.Control type="email" placeholder="Email"/>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mb-3">
                            <InputGroup>
                                <InputGroup.Text><FaLock/></InputGroup.Text>
                                <Form.Control type="password" placeholder="Senha"/>
                            </InputGroup>
                        </Form.Group>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <CustomButton type="submit" style={{fontWeight: "bold",width: '60%', backgroundColor: "#16afa0", borderColor: "#16afa0"}}>
                                Cadastrar
                            </CustomButton>
                        </div>

                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
