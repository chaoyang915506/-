import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'hash',
    routes: [{
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
    }, {
        path: '/main',
        name: 'Main',
        component: () => import('@/views/Main.vue')
    }, {
        path: "/newMain",
        name: "newMain",
        component: () => import('@/views/newMain/Main.vue')
    }
]
});

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next();
    } else {
        const token = sessionStorage.getItem('token');
        const tokenExpire = sessionStorage.getItem('tokenExpire');
        // console.log(token, tokenExpire)
        if (!token || !tokenExpire || parseInt(tokenExpire) < new Date().getTime()) {
            return next('/login');
        } else {
            return next();
        }
    }
});

export default router;