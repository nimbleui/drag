import { createRouter, createWebHashHistory } from "vue-router";
import routers from "./routers";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routers
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("TOKEN_STR");
  const { meta } = to;
  const isNoAuth = meta.isNoAuth;

  if (!isNoAuth && !token) {
    return next("/login");
  }

  next();
});
router.afterEach(() => {
});

export default router;
