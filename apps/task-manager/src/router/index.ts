import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/Dashboard.vue'),
      meta: { title: 'Dashboard', icon: 'dashboard' },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/pages/Tasks.vue'),
      meta: { title: 'Tasks', icon: 'tasks' },
    },
    {
      path: '/tasks/:id',
      name: 'task-detail',
      component: () => import('@/pages/TaskDetail.vue'),
      meta: { title: 'Task Details', parent: 'tasks' },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/pages/Projects.vue'),
      meta: { title: 'Projects', icon: 'projects' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/Settings.vue'),
      meta: { title: 'Settings', icon: 'settings' },
    },
  ],
})

// Update document title on route change
router.beforeEach((to) => {
  const title = to.meta?.title as string | undefined
  document.title = title ? `${title} - Task Manager` : 'Task Manager'
})

export default router
