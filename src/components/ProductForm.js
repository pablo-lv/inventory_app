import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';

import Notification from './Notification'; 

function ProductForm() {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    entry_date: '',
    category: '',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Load product details if 'id' is present
  useEffect(() => {
    const accessToken = localStorage.getItem("token")
    if (id !== 'new') {
      axios.get(`http://localhost:8080/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => {
            if (response.data.entryDate) {
                const formattedDate = new Date(response.data.entryDate).toISOString().split('T')[0];
                response.data.entryDate = formattedDate;
            }
          setProduct(response.data);
        })
        .catch(error => console.error('Error loading the product data:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const method = id === 'new' ? 'post' : 'put';
    const url = id === 'new' ? 'http://localhost:8080/api/products/' : `http://localhost:8080/api/products/${id}`;

    try {
        if (method=='new') {
            console.log("");
        } else {
            const response = await axios.put('http://localhost:8080/api/products', product, {
                headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
             }
            });
        }

        setNotification({
            open: true,
            message: 'Producto Actualizado',
            severity: 'success',
          });
      navigate('/products'); // Redirect to the products page after submit
    } catch (error) {
      console.error('Failed to submit product:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        margin="normal"
        fullWidth
        label="Name"
        name="name"
        value={product.name}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Description"
        name="description"
        value={product.description}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Price"
        type="number"
        name="price"
        value={product.price}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Stock"
        type="number"
        name="stock"
        value={product.stock}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Entry Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        name="entryDate"
        value={product.entryDate}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Category"
        name="category"
        value={product.category}
        onChange={handleChange}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Box>
  );
}

export default ProductForm;
