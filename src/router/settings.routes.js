import { UserProfile } from '@/constants/user-profiles'

export default [
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/SettingsPage.vue'),
    meta: { 
      requiresAuth: true,
      allowedProfiles: [UserProfile.ADMIN, UserProfile.MANAGER]
    }
  },
  {
    path: '/settings/category-product',
    name: 'CategoryProductSettings',
    component: () => import('@/views/settings/CategoryProductPage.vue'),
    meta: { 
      requiresAuth: true,
      allowedProfiles: [UserProfile.ADMIN, UserProfile.MANAGER]
    }
  },
  {
    path: '/settings/financial',
    name: 'FinancialSettings',
    component: () => import('@/views/settings/FinancialSettingsPage.vue'),
    meta: { 
      requiresAuth: true,
      allowedProfiles: [UserProfile.ADMIN, UserProfile.MANAGER]
    }
  },
  {
    path: '/settings/content',
    name: 'ContentSettings',
    component: () => import('@/views/settings/ContentSettingsPage.vue'),
    meta: { 
      requiresAuth: true,
      allowedProfiles: [UserProfile.ADMIN, UserProfile.MANAGER]
    }
  },
  {
    path: '/settings/content/history',
    name: 'HistorySettings',
    component: () => import('@/views/settings/HistorySettingsPage.vue'),
    meta: { 
      requiresAuth: true,
      allowedProfiles: [UserProfile.ADMIN, UserProfile.MANAGER]
    }
  },
  {
    path: '/settings/content/suppliers',
    name: 'SuppliersSettings',
    component: () => import('@/views/settings/SuppliersSettingsPage.vue'),
    meta: { 
      requiresAuth: true,
      allowedProfiles: [UserProfile.ADMIN, UserProfile.MANAGER]
    }
  },
  {
    path: '/settings/content/career',
    name: 'CareerSettings',
    component: () => import('@/views/settings/CareerSettingsPage.vue'),
    meta: { 
      requiresAuth: true,
      allowedProfiles: [UserProfile.ADMIN, UserProfile.MANAGER]
    }
  },
  {
    path: '/settings/home',
    name: 'HomeSettings',
    component: () => import('@/views/settings/HomeSettingsPage.vue'),
    meta: { 
      requiresAuth: true,
      allowedProfiles: [UserProfile.ADMIN, UserProfile.MANAGER]
    }
  }
]
