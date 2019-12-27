import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login/Login'
import App from '@/App'
import Content from '@/components/content/Content'
import Submit from '@/components/content/Submit'
import List from '@/components/content/List'
import CreateModular from '@/components/content/CreateModular'
import Batch from '@/components/content/Batch'
import Out from '@/components/content/Out'
import Breakage from '@/components/content/Breakage'
import BreakList from '@/components/content/BreakList'
import Scan_enter from '@/components/content/Scan_enter'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/login',
      name: 'App',
      component: App
    },{
      path: '/content',
      name: 'Content',
      component: Content
    },{
      path: '/submit',
      name: 'Submit',
      component: Submit
    },{
      path: '/list',
      name: 'List',
      component: List
    },{
      path: '/createmodular',
      name: 'CreateModular',
      component: CreateModular
    },{
      path: '/batch',
      name: 'Batch',
      component: Batch
    },{
      path: '/out',
      name: 'Out',
      component: Out
    },{
      path: '/breakage',
      name: 'Breakage',
      component: Breakage
    },{
      path: '/breakList',
      name: 'BreakList',
      component: BreakList
    },{
      path: '/scan_enter',
      name: 'Scan_enter',
      component: Scan_enter
    }

  ]
})
