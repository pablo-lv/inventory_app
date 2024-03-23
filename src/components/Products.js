import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 , editable: true},
  { field: 'name', headerName: 'Name', width: 150, editable: true },
  { field: 'description', headerName: 'Description', width: 250, editable: true },
  { field: 'price', headerName: 'Price', width: 100, editable: true },
  { field: 'stock', headerName: 'Stock', width: 100, editable: true },
  { field: 'entry_date', headerName: 'Entry Date', width: 110, editable: true },
  { field: 'category', headerName: 'Category', width: 150, editable: true },
  // Ensure each field you want to display is listed in your columns.
];

function Products() {

  const [productData, setProductData] = useState([]);

  const updatedProduct = async (product) =>{
    try {
      console.log(product)
      // Replace 'YOUR_ACCESS_TOKEN' with the token you have
      const accessToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbkBnb29nbGUuY29tIiwiaWF0IjoxNzExMjE3ODYwLCJleHAiOjE3MTEzMDQyNjB9.k2knGiRfiV4iSH9kA-vL_B-nZT8gqHyOi7S1aPiFOrasxc8YksM39TGVLnPYOttt';
      const response = await axios.put('http://localhost:8080/api/products', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setProductData(response.data);
    } catch (error) {
      console.error('There was an error fetching the product data:', error);
    }
  
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Replace 'YOUR_ACCESS_TOKEN' with the token you have
        const accessToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbkBnb29nbGUuY29tIiwiaWF0IjoxNzExMjE3ODYwLCJleHAiOjE3MTEzMDQyNjB9.k2knGiRfiV4iSH9kA-vL_B-nZT8gqHyOi7S1aPiFOrasxc8YksM39TGVLnPYOttt';
        const response = await axios.get('http://localhost:8080/api/products', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setProductData(response.data);
      } catch (error) {
        console.error('There was an error fetching the product data:', error);
      }
    };

    fetchProducts();
  }, []); 

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        editMode='row'
        rows={productData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row.id} // Use a unique 'id' field for each row
        processRowUpdate={(updatedRow, originalRow) =>
          updatedProduct(updatedRow)
        }
      />
    </div>
  );
}

export default Products;
