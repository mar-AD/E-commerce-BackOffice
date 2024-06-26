import React, { useContext } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Login from "./Pages/Login/Login.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import Edit from "./Pages/Edit/Edit.jsx";
import Users from "./Pages/Users/Users.jsx";
import PasswordResetProcess from "./Pages/Login/PasswordReset.jsx";
import Customers from "./Pages/Customers/Customers.jsx";
import Orders from "./Pages/Orders/Orders.jsx";
import Payement from "./Pages/Payement/Payement.jsx";
import ProductsList from "./Pages/Products/Products.jsx";
import Menu from "./Partials/Menu/Menu";
import Navbar from "./Partials/Navbar/Navbar";
import Categories from "./Pages/Catrgories/Catrgories.jsx";
import Subcategories from "./Pages/Subcategories/Subcategories.jsx";
import { AuthContext } from "./AuthContext";
import './Styles/App.css'

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
              <Route path="/Login" element={<Login />} />
              <Route path="/reset-password/:token" element={<PasswordResetProcess />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Edit" element={<Edit />} />
              <Route path="/Users" element={<Users />} />
              <Route path="/Customers" element={<Customers />} />
              <Route path="/Orders" element={<Orders />} />
              <Route path="/Payement" element={<Payement />} />
              <Route path="/Products" element={<ProductsList />} />
              <Route path="/Categories" element={<Categories />} />
              <Route path="/Subcategories" element={<Subcategories />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/Login" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
