/*
Copyright (c) 2018 inSpace Technologies Ltd
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
import Vue from 'vue';
import VueRouter from 'vue-router';

import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';

import WebFont from 'webfontloader';

import 'noty/lib/noty.css';
import 'noty/lib/themes/relax.css';

import 'reset-css/reset.css';

// font awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome, faCoins,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// components

import appComponent from './components/App.vue';

// pages
import homeComponent from './components/pages/Home.vue';
import eosSetupComponent from './components/pages/EosSetup.vue';
import notFoundComponent from './components/pages/404.vue';
import purchasePageComponent from './components/pages/Purchase.vue';
import iscoinPageComponent from './components/pages/Iscoin.vue';

import navbarComponent from './components/Navbar.vue';
import stringPromptComponent from './components/StringPrompt.vue';
import modalDialogComponent from './components/ModalDialog.vue';
import scatterSetupComponent from './components/ScatterSetup.vue';

import store from './store';

// custom CSS
import './style/theme.css';
import './style/card.css';
import './style/modal-dialog.css';

// load font synchronously so it is available immediately
WebFont.load({
  google: {
    families: ['Roboto'],
  },
});

// register components
Vue.component('navbar', navbarComponent);
Vue.component('string-prompt', stringPromptComponent);
Vue.component('modal-dialog', modalDialogComponent);
Vue.component('scatter-setup', scatterSetupComponent);

// font awesome
library.add(faHome);
library.add(faCoins);
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
      path: '/eossetup',
      name: 'eos-setup',
      component: eosSetupComponent,
    },
    {
      path: '/iscoin',
      name: 'iscoin',
      component: iscoinPageComponent,
    },
    {
      path: '/purchase',
      name: 'purchase',
      component: purchasePageComponent,
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

// do some things when the identity has been set

store.watch((state, getters) => getters['eos/identitySet'], async () => {
  await store.dispatch('iscoin/getIscoinData');
});

// Scatter

const network = ScatterJS.Network.fromJson({
  protocol: process.env.EOS_PROTOCOL,
  blockchain: 'eos',
  host: process.env.EOS_HOST,
  port: process.env.EOS_PORT,
  chainId: process.env.EOS_CHAIN_ID,
});

// Scatter

ScatterJS.plugins(new ScatterEOS());

// wait for Scatter before creating the Vue app
ScatterJS.scatter.connect(process.env.APP_NAME, { network }).then((connected) => {
  if (connected) {
    const { scatter } = ScatterJS;
    store.commit('scatter/setScatter', { network, scatter });
    window.ScatterJS = null;
  }

  // eslint-disable-next-line no-new
  new Vue({
    el: '#app',
    store,
    router: Vue.router,
    render: h => h(appComponent),
  });
});
