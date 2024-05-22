import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Login from "./pages/login";
import Home from "./pages/home";
import Layout from './components/layout';
import Product from "./pages/product";
import Cart from "./pages/cart";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path="product" element={<Product/>}/>
                <Route path="cart" element={<Cart/>}/>
            </Route>
        </Routes>
    );
}

export default AppRoutes;
