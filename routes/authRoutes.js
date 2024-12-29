import express from  'express';
const router = express.Router()
import { registerUser, loginUser} from '../controllers/userController.js';
import {addProduct, deleteProduct, updateProducts, viewProducts} from "../controllers/productController.js"
import {getOrders, placeOrder, updateOrderStatus} from "../controllers/orderController.js"
import {addToCart, clearCart, removeCartItem, updateCartItem, viewCart} from "../controllers/cartController.js"
import {admin,protect} from "../middlewares/authMiddleware.js"

// USER ROUTES
router.post('/register', registerUser)
router.post('/login', loginUser)

// PRODUCTS ROUTES
router.post('/products',protect, admin, addProduct)
router.get('/products', viewProducts)
router.patch('/products/:id', protect, admin, updateProducts)
router.delete('/products/:id',protect, admin, deleteProduct)

// ORDER ROUTES
router.post('/orders',protect, placeOrder)
router.post('/orders/:id',protect, admin, updateOrderStatus)
router.get('/orders',protect, admin, getOrders)

// CART ROUTES
router.post('/cart', protect, addToCart)
router.get('/cart', protect, viewCart)
router.patch('/cart', protect, updateCartItem)
router.delete('/cart/:productId', protect, removeCartItem)
router.delete('/cart', protect, clearCart)



export default router;
