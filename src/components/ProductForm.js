import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

import Notification from './Notification'; 

function isDST(date) {
  const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  return date.getTimezoneOffset() < Math.max(jan, jul);
}

function getMexicoCityDate() {
  function isDST(date) {
      const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
      const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      return date.getTimezoneOffset() < Math.max(jan, jul);
  }

  const currentDate = new Date();
  const isDst = isDST(currentDate);
  const mxOffset = isDst ? -5 : -6; // Mexico City timezone offset for DST or Standard Time
  const mxDate = new Date(currentDate.getTime() + mxOffset * 3600 * 1000);
  const formattedDate = mxDate.toISOString().split('T')[0];

  return formattedDate;
}


function ProductForm() {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    entryDate: '', // Set current date for new products
    category: '',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Categories list example
  const categories = ['Farmacia', 'Abarrotes', 'Cremeria'];

  // Load product details if 'id' is present and not 'new'
  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (id !== undefined) {
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
    } else {
      setProduct(prev => ({
        ...prev,
        entryDate: getMexicoCityDate()  // Sets the current date for new products
      }));
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
    const method = id === undefined ? 'post' : 'put';

    try {
        let response;
        
        const currentDate = new Date();
            const isDst = isDST(currentDate);
            const mxOffset = isDst ? -5 : -6;
            const mxDate = new Date(currentDate.getTime() + (mxOffset * 60 * 60 * 1000));
            const formattedTime = mxDate.toISOString().substring(11, 19);
            const dateToSend = `${product.entryDate}T${formattedTime}`;
            product.entryDate = dateToSend;
        if (method === 'post') {
            response = await axios.post('http://localhost:8080/api/products', product, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        } else {
            response = await axios.put('http://localhost:8080/api/products', product, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        }

        setNotification({
            open: true,
            message: 'Product Updated',
            severity: 'success',
        });
        
        setTimeout(() => {
          navigate('/products');
      }, 1500);
    } catch (error) {
        console.error('Failed to submit product:', error);
        setNotification({
            open: true,
            message: 'The product already exists',
            severity: 'error',
        });
    }
};

const handleClose = () => {
  setNotification({ ...notification, open: false });
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
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          label="Category"
          name="category"
          value={product.category}
          onChange={handleChange}
        >
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
      <Notification
        open={notification.open}
        setOpen={handleClose}
        message={notification.message}
        severity={notification.severity}
      />
    </Box>
  );
}

export default ProductForm;
