/*
Copyright (c) 2018 inSpace Technologies Ltd
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
import Vue from 'vue';
import Vuex from 'vuex';

import stringPrompt from './modules/string-prompt';
import scatter from './modules/scatter';
import eos from './modules/eos';
import iscoin from './modules/iscoin';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    stringPrompt,
    scatter,
    eos,
    iscoin,
  },
});

export default store;
