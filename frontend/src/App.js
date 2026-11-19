import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import Login from './pages/Login';
import './App.css';
import About from './pages/About';
import AdminDashboard from "./pages/AdminDashboard";
import Users from './pages/Users';
import RoleRoute from './RoleRoute';
import { getAuth } from './auth';

function App() {
  // Source unique : la session du nouveau système
  const [isAdmin, setIsAdmin] = useState(() => !!getAuth());

  return (
    <BrowserRouter>
      <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />
        <Route path="/orders" element={
          <RoleRoute roles={['ADMIN', 'BARISTA']}><Orders /></RoleRoute>
        } />
        <Route path="/admin" element={
          <RoleRoute roles={['ADMIN', 'BARISTA']}><Admin /></RoleRoute>
        } />
        <Route path="/admindashboard" element={
          <RoleRoute roles={['ADMIN']}><AdminDashboard /></RoleRoute>
        } />
        <Route path="/admin/users" element={
          <RoleRoute roles={['ADMIN']}><Users /></RoleRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;