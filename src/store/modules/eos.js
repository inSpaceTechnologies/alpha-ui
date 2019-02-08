/*
Copyright (c) 2018 inSpace Technologies Ltd
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
const storeState = {
};

const storeGetters = {
  scatterIdentitySet: (state, getters, rootState) => rootState.scatter.identitySet,
  identitySet: (state, getters) => {
    if (getters.scatterIdentitySet) {
      return true;
    }
    return false;
  },
  accountName: (state, getters, rootState, rootGetters) => {
    if (getters.scatterIdentitySet) {
      return rootGetters['scatter/accountName'];
    }
    return null;
  },
  publicKey: (state, getters, rootState, rootGetters) => {
    if (getters.scatterIdentitySet) {
      return rootGetters['scatter/publicKey'];
    }
    return null;
  },
};

const storeMutations = {
};

const storeActions = {
  async getTableRows({ getters, dispatch }, {
    scope, code, table, limit,
  }) {
    if (getters.scatterIdentitySet) {
      const res = await dispatch('scatter/getTableRows', {
        scope, code, table, limit,
      }, { root: true });
      return res;
    }
    throw new Error('Identity not set.');
  },
  async transact({ getters, dispatch }, {
    account, name, auth, data,
  }) {
    if (getters.scatterIdentitySet) {
      await dispatch('scatter/transact', {
        account, name, auth, data,
      }, { root: true });
      return;
    }
    throw new Error('Identity not set.');
  },
};

export default {
  namespaced: true,
  state: storeState,
  getters: storeGetters,
  actions: storeActions,
  mutations: storeMutations,
};
