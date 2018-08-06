/*
Copyright (c) 2018 inSpace Technologies Ltd
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';

import VueAuth from '@websanova/vue-auth';
import VueAuthBearer from '@websanova/vue-auth/drivers/auth/bearer';
import VueAuthAxios from '@websanova/vue-auth/drivers/http/axios.1.x';
import VueAuthRouter from '@websanova/vue-auth/drivers/router/vue-router.2.x';

import WebFont from 'webfontloader';

import 'reset-css/reset.css';
import 'noty/lib/noty.css';
import 'noty/lib/themes/relax.css';

// font awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faSignInAlt, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// components
import appComponent from './components/App.vue';

import homeComponent from './components/pages/Home.vue';
import loginComponent from './components/pages/Login.vue';
import signupComponent from './components/pages/Signup.vue';
import notFoundComponent from './components/pages/404.vue';
import adminComponent from './components/pages/Admin.vue';

import navbarComponent from './components/Navbar.vue';
import scatterSetupComponent from './components/ScatterSetup.vue';
import filespaceItemComponent from './components/FilespaceItem.vue';
import stringPromptComponent from './components/StringPrompt.vue';
import alertComponent from './components/Alert.vue';
import modalDialogComponent from './components/ModalDialog.vue';

import store from './store';

// custom CSS
import './style/theme.css';
import './style/card.css';
import './style/form.css';
import './style/modal-dialog.css';

// load font synchronously so it is available immediately
WebFont.load({
  google: {
    families: ['Roboto'],
  },
});

// register components
Vue.component('navbar', navbarComponent);
Vue.component('scatter-setup', scatterSetupComponent);
Vue.component('filespace-item', filespaceItemComponent);
Vue.component('string-prompt', stringPromptComponent);
Vue.component('alert', alertComponent);
Vue.component('modal-dialog', modalDialogComponent);

// font awesome
library.add(faHome);
library.add(faSignInAlt);
library.add(faSignOutAlt);
library.add(faUserPlus);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

// vue-router

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: homeComponent,
    },
    {
      path: '/admin',
      meta: {
        auth: {
          roles: 'admin',
        },
      },
      component: adminComponent,
    },
    // dummy page that requires auth, for testing
    {
      path: '/secure',
      name: 'secure',
      component: { template: '<div>secure</div>' },
      meta: { auth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: loginComponent,
      meta: { auth: false },
    },
    {
      path: '/signup',
      name: 'signup',
      component: signupComponent,
      meta: { auth: false },
    },
    {
      path: '/404',
      name: '404',
      component: notFoundComponent,
    },
    {
      path: '*',
      redirect: { name: '404' },
    },
  ],
});

Vue.use(VueRouter);
Vue.router = router;

// Scatter

const network = {
  protocol: 'http',
  blockchain: 'eos',
  host: process.env.EOS_HOST,
  port: process.env.EOS_PORT,
  chainId: process.env.EOS_CHAIN_ID,
};

document.addEventListener('scatterLoaded', () => {
  // Scatter will now be available from the window scope.
  // At this stage the connection to Scatter from the application is
  // already encrypted.
  // const scatter = window.scatter;
  const { scatter } = window;

  store.commit('setScatter', { network, scatter });

  // It is good practice to take this off the window once you have
  // a reference to it.
  window.scatter = null;
});

// vue-axios

Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = process.env.API_SERVER_HOST;

// vue-auth

Vue.use(VueAuth, {
  auth: VueAuthBearer,
  http: VueAuthAxios,
  router: VueAuthRouter,
});

// Vue app

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  router: Vue.router,
  render: h => h(appComponent),
});
