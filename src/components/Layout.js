import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline } from '@mui/material';
import { Dashboard, ShoppingBasket, Receipt, AccountCircle } from '@mui/icons-material';
import { Link, Outlet } from 'react-router-dom';

const drawerWidth = 240;

function Layout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Inventory App
          </Typography>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', top: '64px' }, // Adjust top to match AppBar height
        }}
      >
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon><Dashboard /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/products">
            <ListItemIcon><ShoppingBasket /></ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem button component={Link} to="/orders">
            <ListItemIcon><Receipt /></ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}
      >
        <main>
          <Outlet /> 
        </main>
      </Box>
    </Box>
  );
}

export default Layout;
