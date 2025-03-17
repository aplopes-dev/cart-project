import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import HistoryView from '../views/HistoryView.vue'
import SuppliersView from '../views/SuppliersView.vue'
import CareerView from '../views/CareerView.vue'
import CheckoutPage from '@/views/CheckoutPage.vue'
import ThankYouPage from '@/views/ThankYouPage.vue'
import CategoryPage from '@/views/CategoryPage.vue'
import ContactView from '@/views/ContactView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/history',
    name: 'history',
    component: HistoryView
  },
  {
    path: '/suppliers',
    name: 'suppliers',
    component: SuppliersView
  },
  {
    path: '/career',
    name: 'career',
    component: CareerView
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue')
  },
  {
    path: '/shopping-cart',
    name: 'ShoppingCart',
    component: () => import('../views/ShoppingCartPage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/SignupPage.vue')
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutPage
  },
  {
    path: '/thank-you',
    name: 'ThankYou',
    component: ThankYouPage
  },
  {
    path: '/product/:id',
    name: 'ProductDetails',
    component: () => import('../views/ProductDetailsPage.vue')
  },
  {
    path: '/category/:slug',
    name: 'category',
    component: CategoryPage
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactView
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPasswordPage.vue')
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: () => import('../views/ResetPasswordPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)
  next()
})

export default router