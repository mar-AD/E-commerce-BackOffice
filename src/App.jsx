import React, { useContext } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Edit from "./pages/Edit/Edit.jsx";
import Users from "./pages/Users/Users.jsx";
import Customers from "./pages/Customers/Customers.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import Payement from "./pages/Payement/Payement.jsx";
import ProductsList from "./pages/Products/Products.jsx";
import Menu from "./Partials/Menu/Menu";
import Navbar from "./Partials/Navbar/Navbar";
import Categories from "./pages/Catrgories/Catrgories.jsx";
import Subcategories from "./pages/Subcategories/Subcategories.jsx";
import PasswordResetProcess from "./Pages/Login/PasswordReset.jsx";
import { AuthContext } from "./AuthContext";
import './App.css'

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <>
      <BrowserRouter>
        {authCtx.token && <Navbar />}
        {authCtx.token && <Menu />}
        <Routes>
          {!authCtx.token || authCtx.refToken ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password/:token" element={<PasswordResetProcess />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/edit" element={<Edit />} />
              <Route path="/users" element={<Users />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/payement" element={<Payement />} />
              <Route path="/products" element={<ProductsList />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/subcategories" element={<Subcategories />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
