import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Orders from './components/Orders';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import AuthRoute from './components/AuthRoute';
import ProductForm from './components/ProductForm';
import ProductsStore from './components/ProductsStore';
import Sales from './components/Sales';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AuthRoute><ProductsStore /></AuthRoute>} />
          <Route path="products" element={<AuthRoute><Products /></AuthRoute>} />
          <Route path="store" element={<AuthRoute><ProductsStore /></AuthRoute>} />
          <Route path="products/:id" element={<AuthRoute><ProductForm /></AuthRoute>} />
          <Route path="products/new" element={<AuthRoute><ProductForm /></AuthRoute>} />
          <Route path="sales" element={<AuthRoute><Sales /></AuthRoute>} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
