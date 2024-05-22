import React from 'react';
import {Navbar, Nav, Form, FormControl, Container, InputGroup, Popover, OverlayTrigger} from 'react-bootstrap';
import {FaSearch, FaUser} from 'react-icons/fa';
import {BiCart} from "react-icons/bi";
import {useNavigate} from 'react-router-dom';
import {AiOutlineHome} from "react-icons/ai";
import CustomButton from "../custom-button";


function CustomNavbar() {
    const navigate = useNavigate();

    const handleCartClick = () => {
        navigate('/cart');
    };
    const handleHomeClick = () => {
        navigate('/');
    };

    const userPopover = (
        <Popover id="popover-basic">
            <Popover.Body>
                <CustomButton  onClick={() => navigate('/login')}>
                    Entrar
                </CustomButton>
            </Popover.Body>
        </Popover>
    );

    return (
        <Navbar style={{backgroundColor: '#d2e4e1', minHeight: "5rem"}} expand="lg">
            <Container>
                <Navbar.Brand style={{cursor: "pointer"}} onClick={handleHomeClick}>
                    <AiOutlineHome size={35} color="#207869"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Form className="mx-auto" style={{width: '50%'}}>
                        <InputGroup>
                            <FormControl type="search" placeholder="Encontre sua roupa ideal"/>
                            <InputGroup.Text style={{cursor: "pointer"}}>
                                <FaSearch color="#207869"/>
                            </InputGroup.Text>
                        </InputGroup>
                    </Form>
                    <Nav className="ml-auto">
                        <Nav.Link onClick={handleCartClick}>
                            <BiCart size={35} color="#207869"/>
                        </Nav.Link>
                        <OverlayTrigger trigger="click" placement="bottom" overlay={userPopover}>
                            <Nav.Link>
                                <FaUser size={35} color="#207869"/>
                            </Nav.Link>
                        </OverlayTrigger>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;
