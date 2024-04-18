import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';


import axios from 'axios';

import Notification from './Notification'; 

function Products() {

  const [productData, setProductData] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const navigate = useNavigate();

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Nombre', width: 150 },
    { field: 'description', headerName: 'Descripción', width: 250 },
    { field: 'price', headerName: 'Precio', width: 100 },
    { field: 'stock', headerName: 'Stock', width: 100 },
    { field: 'entryDate', headerName: 'Fecha Entrada', width: 200 },
    { field: 'category', headerName: 'Categoría', width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Button
              color="primary"
              size="small"
              onClick={() => handleUpdate(params.id)}
              style={{ marginRight: 16 }}
            >
              Actualizar
            </Button>
            <Button
              color="secondary"
              size="small"
              onClick={() => handleDelete(params.id)}
            >
              Borrar
            </Button>
          </>
        );
      }
    },
  ];


  const updatedProduct = async (product) =>{
    try {
      console.log(product)
      const accessToken = localStorage.getItem("token")
      const response = await axios.put('http://localhost:8080/api/products', product, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      setNotification({
        open: true,
        message: 'Producto Actualizado',
        severity: 'success',
      });
      
    } catch (error) {
      setNotification({
        open: true,
        message: 'An error occurred!',
        severity: 'error',
      });
      console.error('There was an error fetching the product data:', error);
    }
  
  }

  const handleUpdate = (id) => {
    // Navigate to update product page with product id
    navigate(`/products/${id}`);
  };
  
  const handleDelete = async (id) => {
    try {
      const accessToken = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setProductData(productData.filter((product) => product.id !== id));
      setNotification({
        open: true,
        message: 'Producto eliminado correctamente',
        severity: 'success',
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Error eliminando el producto',
        severity: 'error',
      });
      console.error('Error deleting the product:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
  
        const accessToken = localStorage.getItem("token")
        const response = await axios.get('http://localhost:8080/api/products', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        response.data.forEach(item => {
          if (item.entryDate) {
            const [year, month, day, hour, minute, second] = item.entryDate;
            const date = new Date(year, month - 1, day, hour, minute, second);
            
            const formattedDate = date.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true // Set to false if you prefer 24-hour format
            });
              item.entryDate = formattedDate;
          }
      });
        setProductData(response.data);
      } catch (error) {
        console.error('There was an error fetching the product data:', error);
      }
    };

    fetchProducts();
  }, []); 


  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  const handleCreateNewProduct = () => {
    navigate('/products/new');
  };

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateNewProduct}
        >
          Agregar Producto
        </Button>
      </Box>
      <DataGrid
        editMode='row'
        rows={productData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row.id} // Use a unique 'id' field for each row
        processRowUpdate={(updatedRow, originalRow) =>updatedProduct(updatedRow) }
      />
      <Notification
        open={notification.open}
        setOpen={handleClose}
        message={notification.message}
        severity={notification.severity}
      />
    </div>
  );
}

export default Products;
