import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';


import axios from 'axios';

import Notification from './Notification'; 

function Sales() {

  const [salesData, setSalesData] = useState([]);

  const navigate = useNavigate();

  const columns = [
    { field: 'idSale', headerName: 'ID', width: 90 },
    { field: 'total', headerName: 'Total', width: 150, renderCell: (params) => {
      // Format the price as currency
      return `$${params.value.toFixed(2)}`;
  }},
    { field: 'productNames', headerName: 'Productos Vendidos', width: 350, 
    renderCell: (params) => (
      <div style={{ whiteSpace: 'normal', lineHeight: 1.5 }}>
          {params.value}
      </div>
  ) },
    { field: 'createdAt', headerName: 'Fecha de Venta', width: 200 },
  ,
  ];


  useEffect(() => {
    const fetchSales = async () => {
      try {
  
        const accessToken = localStorage.getItem("token")
        const response = await axios.get('http://localhost:8080/api/sales', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        response.data.forEach(item => {
          if (item.createdAt) {
            const [year, month, day, hour, minute, second] = item.createdAt;
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
              item.createdAt = formattedDate;
          }
      });
        setSalesData(response.data);
      } catch (error) {
        console.error('There was an error fetching the product data:', error);
      }
    };

    fetchSales();
  }, []); 


  

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        editMode='row'
        rows={salesData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row.idSale} // Use a unique 'id' field for each row}
      />
    </div>
  );
}

export default Sales;
