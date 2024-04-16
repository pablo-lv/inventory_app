import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardActions, Typography, Button, IconButton, Badge, Menu, MenuItem, Divider, Tooltip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from 'axios';

import { useNavigate } from 'react-router-dom';

class ProductDTO {
    constructor(id, quantity, price) {
        this.id = id;
        this.quantity = quantity;
        this.price = price;
    }
}


function ProductStore() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null); // For the cart dropdown

    const calculateTotal = () => {
        return cart.reduce((acc, current) => acc + current.price, 0).toFixed(2);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/products', {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                  });;
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        };
        fetchProducts();
    }, []);

    const addToCart = (product) => {
        setCart(currentCart => [...currentCart, product]);
    };

    const handleCartClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const cartItemCount = cart.length;

    const navigate = useNavigate();

    const aggregateCartItems = (cart) => {
        const aggregatedItems = cart.reduce((acc, item) => {
            if (acc[item.id]) {
                // If the item already exists, increment the quantity
                acc[item.id].quantity += 1;
            } else {
                // Otherwise, initialize the item with a quantity of 1
                acc[item.id] = {...item, quantity: 1};
            }
            return acc;
        }, {});
    
        // Convert the object back into an array
        return Object.values(aggregatedItems);
    };

    const handleProceedToPayment = async () => {
        // Aggregate items in the cart to summarize quantities
        const aggregatedItems = aggregateCartItems(cart);

        // Map aggregated items to ProductDTO instances
        const productDTOs = aggregatedItems.map(item => new ProductDTO(item.id, item.quantity, item.price));

        // Calculate the total cost of the products in the cart
        const total = productDTOs.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Prepare the SaleRequest object
        const saleRequest = {
            products: productDTOs,
            total: total
        };


        try {
            const response = await axios.post(`http://localhost:8080/api/sales`, saleRequest, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
              });
            console.log("Sale response:", response.data);

            navigate("/sales");
        
        } catch (error) {
            console.error("Failed to process sale:", error);
        }
    };
    

    const removeFromCart = (productId) => {
        setCart(currentCart => currentCart.filter(item => item.id !== productId));
    };

    return (
        <div style={{ padding: 20 }}>
            <IconButton aria-label="cart" style={{  position: 'fixed', right:30, top: 100, zIndex: 1000 }} onClick={handleCartClick}>
                <Badge badgeContent={cartItemCount} color="secondary">
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>
            
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            {cart.length > 0 ? cart.map((item, index) => (
                <MenuItem key={index} onClick={() => { }}>
                    {item.name} - ${item.price.toFixed(2)}
                    <IconButton
                        size="small"
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent menu close
                            removeFromCart(item.id);
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </MenuItem>
            )) : (
                <MenuItem onClick={handleClose}>Carrito de compra vacio</MenuItem>
            )}
            {cart.length > 0 && (
                <>
                <Divider/>
                    <MenuItem disabled>
                        <Typography color="text.secondary" style={{color: "blue"}}>
                            Total: ${calculateTotal()}
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleProceedToPayment}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 1, mb: 1 }}
                    >
                        Pagar
                    </Button>
                    </MenuItem>
                </>
            )}
        </Menu>
            <Grid container spacing={2} style={{  right: 0, paddingTop: 60 }}>
                {products.map(product => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {product.name}
                                </Typography>
                                <Typography color="text.secondary">
                                    Price: ${product.price.toFixed(2)}
                                </Typography>
                                <Typography variant="body2">
                                    {product.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                            <Tooltip title="Sin productos" disableFocusListener disableTouchListener>
                                <span>
                                    <Button 
                                        size="small" 
                                        onClick={() => addToCart(product)} 
                                        disabled={product.stock === 0}
                                    >
                                        Agregar
                                    </Button>
                                </span>
                            </Tooltip>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default ProductStore;
