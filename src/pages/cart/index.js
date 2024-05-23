import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomButton from "../../components/custom-button";

const initialProducts = [
    {
        id: 1,
        name: 'Produto 1',
        image: 'https://via.placeholder.com/150',
        quantity: 1,
    },
    {
        id: 2,
        name: 'Produto 2',
        image: 'https://via.placeholder.com/150',
        quantity: 2,
    },
    {
        id: 3,
        name: 'Produto 3',
        image: 'https://via.placeholder.com/150',
        quantity: 1,
    },
];

function Cart() {
    const [products, setProducts] = useState(initialProducts);

    const handleQuantityChange = (id, newQuantity) => {
        setProducts(products.map(product =>
            product.id === id ? { ...product, quantity: newQuantity } : product
        ));
    };

    const calculateTotal = () => {
        return products.reduce((total, product) => total + product.quantity * 100, 0);
    };

    return (
        <Container fluid style={{ paddingTop: '20px' }}>
            <Row>
                <Col md={8}>
                    <Card>
                        <Card.Header>Produtos no Carrinho</Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                {products.map(product => (
                                    <ListGroup.Item key={product.id}>
                                        <Row className="align-items-center">
                                            <Col md={3}>
                                                <img src={product.image} alt={product.name} style={{ width: '100%' }} />
                                            </Col>
                                            <Col md={4}>
                                                <h5>{product.name}</h5>
                                            </Col>
                                            <Col md={3}>
                                                <InputGroup>
                                                    <Button variant="outline-secondary"
                                                            onClick={() => handleQuantityChange(product.id, Math.max(product.quantity - 1, 1))}>-</Button>
                                                    <Form.Control
                                                        type="number"
                                                        value={product.quantity}
                                                        onChange={(e) => handleQuantityChange(product.id, Math.max(parseInt(e.target.value), 1))}
                                                        style={{ textAlign: 'center' }}
                                                    />
                                                    <Button variant="outline-secondary"
                                                            onClick={() => handleQuantityChange(product.id, product.quantity + 1)}>+</Button>
                                                </InputGroup>
                                            </Col>
                                            <Col md={2}>
                                                <h5>R${product.quantity * 100}</h5> {}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Form>
                        <Card className="mb-3">
                            <Card.Header>Detalhes da Entrega</Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-2" controlId="formStreet">
                                    <Row>
                                        <Col md={8}>
                                            <Form.Label>Logradouro*</Form.Label>
                                            <Form.Control type="text" placeholder="Rua" required />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>Número*</Form.Label>
                                            <Form.Control type="text" placeholder="Número" required />
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group className="mb-2" controlId="formComplement">
                                    <Form.Label>Complemento</Form.Label>
                                    <Form.Control type="text" placeholder="Complemento" />
                                </Form.Group>
                                <Form.Group className="mb-2" controlId="formCity">
                                    <Form.Label>Cidade*</Form.Label>
                                    <Form.Control type="text" placeholder="Cidade" required />
                                </Form.Group>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>Informações de Pagamento</Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-2" controlId="formPayment">
                                    <Form.Label>Forma de Pagamento*</Form.Label>
                                    <Form.Control as="select" required>
                                        <option value="">Selecione...</option>
                                        <option>Cartão de Crédito</option>
                                        <option>Cartão de Débito</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-2" controlId="formCardNumber">
                                    <Form.Label>Número do Cartão*</Form.Label>
                                    <Form.Control type="text" placeholder="Número do Cartão" required />
                                </Form.Group>
                                <Form.Group className={"mb-2"} controlId="formExpiration">
                                    <Row>
                                        <Col md={4}>
                                            <Form.Label>CVC*</Form.Label>
                                            <Form.Control type="text" placeholder="CVC" required />
                                        </Col>

                                        <Col md={8}>
                                            <Form.Label>Data de Vencimento*</Form.Label>
                                            <Form.Control type="text" placeholder="MM/AA" required />
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="formTotal">
                                    <Form.Label>Total a Pagar</Form.Label>
                                    <Form.Control type="text" value={`R$ ${calculateTotal()}`} readOnly />
                                </Form.Group>
                                <CustomButton variant="primary" type="submit" style={{ width: '100%', backgroundColor: '#207869', borderColor: '#207869', color: 'white' }}>
                                    Finalizar Compra
                                </CustomButton>
                            </Card.Body>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Cart;
