import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Cart from './pages/Cart/Cart';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import CustomizePizza from './pages/CustomizePizza/CustomizePizza';
import ForgotPasswordPopup from './components/ForgotPasswordPopup/ForgotPasswordPopup';
import ResetPassword from './pages/ResetPassword/ResetPassword';

const App = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    return (
        <>
            {showLogin && <LoginPopup setShowLogin={setShowLogin} setShowForgotPassword={setShowForgotPassword} />}
            {showForgotPassword && <ForgotPasswordPopup setShowForgotPassword={setShowForgotPassword} setShowLogin={setShowLogin} />}
            
            <div className='app'>
                <Navbar setShowLogin={setShowLogin} />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/order' element={<PlaceOrder />} />
                    <Route path='/verify' element={<Verify />} />
                    <Route path='/myorders' element={<MyOrders />} />
                    <Route path='/customizepizza' element={<CustomizePizza />} />
                    <Route path='/reset-password/:token' element={<ResetPassword setShowLogin={ResetPassword.jsx} />} />
                </Routes>
            </div>
            <Footer />
        </>
    );
};

export default App;
