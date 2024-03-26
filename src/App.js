import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Orders from './components/Orders';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import AuthRoute from './components/AuthRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AuthRoute><Dashboard /></AuthRoute>} />
          <Route path="products" element={<AuthRoute><Products /></AuthRoute>} />
          <Route path="orders" element={<AuthRoute><Orders /></AuthRoute>} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
