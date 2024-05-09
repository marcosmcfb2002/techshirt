import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Login from "./pages/login";
import Home from "./pages/home";
import Product from "./pages/product";
import Cart from "./pages/cart";

function AppRoutes() {
    return (
        <Routes>
            <Route path="*" element={<Login/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/product" element={<Product/>}/>
            <Route path="/cart" element={<Cart/>}/>
        </Routes>
    );
}

export default AppRoutes;
