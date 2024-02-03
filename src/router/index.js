import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: 'Home',
      },
      component: () => import('../views/home.vue'),
    },
    {
      path: '/data-piutang-unit',
      name: 'data-piutang-unit',
      meta: {
        title: 'Data Piutang Unit',
      },
      component: () => import('../views/data.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const title = to.meta.title;
  if (title)
    document.title = `Legoas - ${title}`;
  next();
});

export default router;
