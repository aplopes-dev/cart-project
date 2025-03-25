import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/auth.service'
import Home from '../views/Home.vue'
import HistoryView from '../views/HistoryView.vue'
import SuppliersView from '../views/SuppliersView.vue'
import CareerView from '../views/CareerView.vue'
import CheckoutPage from '@/views/CheckoutPage.vue'
import ThankYouPage from '@/views/ThankYouPage.vue'
import CategoryPage from '@/views/CategoryPage.vue'
import ContactView from '@/views/ContactView.vue'
import MyAccountPage from '../views/MyAccountPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import OrdersPage from '../views/OrdersPage.vue'
import SecurityPage from '../views/SecurityPage.vue'

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
    component: () => import('../views/LoginPage.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/SignupPage.vue')
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/thank-you/:orderNumber',
    name: 'ThankYou',
    component: ThankYouPage,
    props: true
  },
  {
    path: '/product/:id',
    name: 'ProductDetails',
    component: () => import('../views/ProductDetailsPage.vue')
  },
  {
    path: '/categories',
    name: 'Categories',
    component: CategoryPage
  },
  {
    path: '/categories/:slug',
    name: 'category-detail',
    component: CategoryPage,
    props: true
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
  },
  {
    path: '/my-account',
    name: 'MyAccount',
    component: MyAccountPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrdersPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/security',
    name: 'Security',
    component: SecurityPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SystemSettingsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/financial',
    name: 'FinancialSettings',
    component: () => import('../views/settings/FinancialSettingsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/content',
    name: 'ContentSettings',
    component: () => import('../views/settings/ContentSettingsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/content',
    name: 'Content',
    component: () => import('../views/settings/ContentSettingsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/content/history',
    name: 'ContentHistorySettings',
    component: () => import('../views/settings/content/HistorySettingsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/content/suppliers',
    name: 'ContentSuppliersSettings',
    component: () => import('../views/settings/content/SuppliersSettingsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/content/career',
    name: 'ContentCareerSettings',
    component: () => import('../views/settings/content/CareerSettingsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/company',
    name: 'CompanySettings',
    component: () => import('../views/settings/CompanySettingsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/addresses',
    name: 'Addresses',
    component: () => import('../views/AddressesPage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  async scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
  } else {
    window.scrollTo(0, 0)
    next()
  }
})

export default router





















