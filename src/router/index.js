import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SignUp from '../components/sessions/sign_up.vue'
import SignIn from '../components/sessions/sign_in.vue'
import WithDrawalNew from '@/views/withdrawal.vue'
import WithDrawal from '@/views/withdrawal_index.vue'

import firebase from 'firebase'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/withdrawal/new',
    name: 'WithDrawalNew',
    component: WithDrawalNew
  },
  {
    path: '/withdrawal',
    name: 'WithDrawal',
    component: WithDrawal
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  let currentUser = firebase.auth().currentUser
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    if (!currentUser) {
      next({
        path: '/signin',
        query: { redirect: to.fullPath }
      })
    } else {
      next();
    }
  } else {
    next(); // next() を常に呼び出すようにしてください!
  }
})

export default router
