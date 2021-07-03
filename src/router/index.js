import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SignUp from '../components/sessions/sign_up.vue'
import SignIn from '../components/sessions/sign_in.vue'
import WithDrawalForm from '../components/household_ledger/withdrawal_form.vue'
import WithDrawalTable from '../components/household_ledger/withdrawal_table.vue'
import WithDrawal from '@/views/withdrawal.vue'

import firebase from 'firebase'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: () => import('../views/About.vue') },
  { path: '/signin', name: 'SignIn', component: SignIn },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/withdrawal', name: 'WithDrawal', component: WithDrawal,
    children: [
      { path: '',      name: 'WithDrawalTable',  component: WithDrawalTable },
      { path: 'new',   name: 'WithDrawalForm',   component: WithDrawalForm  },
      { path: 'month', name: 'WithDrawalForm', component: WithDrawalForm  }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

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
