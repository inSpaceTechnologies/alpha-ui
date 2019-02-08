/*
Copyright (c) 2018 inSpace Technologies Ltd
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
import { JsonRpc, Api } from 'eosjs';
import ScatterJS from 'scatterjs-core';

const BLOCKCHAIN = 'eos';

const storeState = {
  network: null,
  scatter: null,
  api: null,
  rpc: null,
  // scatter.identity cannot be watched, so we add this
  identitySet: false,
};

const storeGetters = {
  accountName: state => state.scatter.identity.accounts.find(acc => acc.blockchain === BLOCKCHAIN).name,
  publicKey: state => state.scatter.identity.accounts.find(acc => acc.blockchain === BLOCKCHAIN).publicKey,
};

const storeMutations = {
  setScatter(state, { network, scatter }) {
    state.scatter = scatter;
    state.network = network;

    const rpc = new JsonRpc(network.fullhost());
    const api = ScatterJS.eos(network, Api, { rpc, beta3: true });

    state.rpc = rpc;
    state.api = api;

    if (scatter.identity) {
      state.identitySet = true;
    }
  },
  setIdentitySet(state, identitySet) {
    state.identitySet = identitySet;
  },
};

const storeActions = {
  async requestIdentity({ state, commit }) {
    // You can require certain fields
    await state.scatter.getIdentity({ accounts: [state.network] });
    commit('setIdentitySet', true);
  },
  suggestNetwork({ state }) {
    return state.scatter.suggestNetwork(state.network);
  },
  forgetIdentity({ state, commit }) {
    return new Promise((resolve, reject) => {
      state.scatter.forgetIdentity().then(() => {
        commit('setIdentitySet', false);
        resolve();
      }, (err) => {
        reject(err);
      });
    });
  },
  async getTableRows({ state }, {
    scope, code, table, limit,
  }) {
    const res = (await state.rpc.get_table_rows({
      json: true,
      scope,
      code,
      table,
      limit,
    }));
    return res.rows;
  },
  async transact({ state }, {
    account, name, auth, data,
  }) {
    const { api } = state;
    await api.transact({
      actions: [{
        account,
        name,
        authorization: [{
          actor: auth,
          permission: 'active',
        }],
        data,
      }],
    }, {
      blocksBehind: parseInt(process.env.BLOCKS_BEHIND, 10),
      expireSeconds: parseInt(process.env.EXPIRE_SECONDS, 10),
    });
  },
};

export default {
  namespaced: true,
  state: storeState,
  getters: storeGetters,
  actions: storeActions,
  mutations: storeMutations,
};
