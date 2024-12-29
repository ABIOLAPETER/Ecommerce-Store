import express from  'express';
const router = express.Router()
import { registerUser, loginUser} from '../controllers/userController.js';
import {addProduct, deleteProduct, updateProducts, viewProducts} from "../controllers/productController.js"
import {getOrders, placeOrder, updateOrderStatus} from "../controllers/orderController.js"
import {addToCart, clearCart, removeCartItem, updateCartItem, viewCart} from "../controllers/cartController.js"
import {admin,protect} from "../middlewares/authMiddleware.js"


router.post('/register', registerUser)
router.post('/login',protect, loginUser)


router.post('/products',protect, admin, addProduct)
router.get('/products', viewProducts)
router.patch('/products/:id', protect, admin, updateProducts)
router.delete('/products/:id',protect, admin, deleteProduct)


router.post('/orders', placeOrder)
router.post('/orders/:id',protect, admin, updateOrderStatus)
router.get('/orders',protect, admin, getOrders)


router.post('/cart', protect, addToCart)
router.get('/cart', protect, viewCart)
router.patch('/cart', protect, updateCartItem)
router.delete('/cart', protect, removeCartItem)
router.post('/cart', protect, clearCart)



export default router;
