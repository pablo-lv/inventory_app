import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardActions, Typography, Button, IconButton, Badge, Menu, MenuItem, Divider, Tooltip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/products', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        };
        fetchProducts();
    }, []);

    const addToCart = (product) => {
        setCart(currentCart => {
            const existingProductIndex = currentCart.findIndex(item => item.id === product.id);
            if (existingProductIndex > -1) {
                // Check if adding another unit exceeds the product's stock
                if (currentCart[existingProductIndex].quantity < product.stock) {
                    const newCart = [...currentCart];
                    newCart[existingProductIndex].quantity += 1; // Increment quantity
                    return newCart;
                } else {
                    // If stock limit is reached, do not add more; optionally alert the user
                    alert(`No se puede agregar más ${product.name}. no hay stock disponible.`);
                    return currentCart; // Return the cart as is
                }
            } else {
                // Product is not in the cart yet, add first item if stock allows
                if (product.stock > 0) {
                    return [...currentCart, { ...product, quantity: 1 }];
                } else {
                    alert(`No se puede agregar más ${product.name}. No stock.`);
                    return currentCart;
                }
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart(currentCart => {
            const index = currentCart.findIndex(item => item.id === productId);
            if (index > -1 && currentCart[index].quantity > 1) {
                const newCart = [...currentCart];
                newCart[index].quantity -= 1;  // Decrement quantity
                return newCart;
            } else {
                // Remove item entirely if quantity is 1 or less
                return currentCart.filter(item => item.id !== productId);
            }
        });
    };

    const removeAllFromCart = (productId) => {
        setCart(currentCart => currentCart.filter(item => item.id !== productId));
    };

    const handleCartClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const calculateTotal = () => {
        return cart.reduce((acc, current) => acc + current.price * current.quantity, 0).toFixed(2);
    };

    const navigate = useNavigate();

    const handleProceedToPayment = async () => {

        // Map cart items to ProductDTO instances
        const productDTOs = cart.map(item => new ProductDTO(item.id, item.quantity, item.price));

        // Calculate the total cost of the products in the cart
        const total = productDTOs.reduce((acc, item) => acc + (item.price * item.quantity), 0);

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

    return (
        <div style={{ padding: 20 }}>
            <IconButton aria-label="cart" style={{ position: 'fixed', right: 30, top: 100, zIndex: 1000 }} onClick={handleCartClick}>
                <Badge badgeContent={cart.reduce((acc, item) => acc + item.quantity, 0)} color="secondary">
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
                    <MenuItem key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" component="p">
                            {item.name} - ${item.price.toFixed(2)} x {item.quantity}
                        </Typography>
                        <div>
                            <IconButton
                                size="small"
                                aria-label="remove one item"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent menu close
                                    removeFromCart(item.id);
                                }}
                            >
                                <RemoveIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                aria-label="add one item"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent menu close
                                    addToCart(item);
                                }}
                            >
                                <AddIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                aria-label="delete"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent menu close
                                    removeFromCart(item.id, true); // Adjust this method if necessary for removing all quantities
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </div>
                    </MenuItem>
                )) : (
                    <MenuItem onClick={handleClose}>Carrito de compra vacio</MenuItem>
                )}
                {cart.length > 0 && (
                    <>
                        <Divider />
                        <MenuItem disabled>
                            <Typography color="blue" style={{ flex: 1 }}>
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
            <Grid container spacing={2} style={{ right: 0, paddingTop: 60 }}>
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
                                <Tooltip title={product.stock > 0 ? "" : "Sin productos"} disableFocusListener disableTouchListener>
                                    <span>
                                        <Button size="small" onClick={() => addToCart(product)} disabled={product.stock === 0}>
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
