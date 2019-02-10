/*
Copyright (c) 2018 inSpace Technologies Ltd
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.
*/
async function getBalance(dispatch, accountName) {
  const accountRows = await dispatch('eos/getTableRows', {
    scope: accountName,
    code: process.env.ISCOIN_CONTRACT,
    table: 'accounts',
    limit: 500,
  }, { root: true });

  let balance = 0;
  accountRows.forEach((accountRow) => {
    const balanceAsset = accountRow.balance.split(' ');
    if (balanceAsset[1] !== process.env.CURRENCY_SYMBOL) {
      return;
    }
    balance = parseFloat(balanceAsset[0]);
  });
  return balance;
}

async function getStakes(dispatch, accountName) {
  const stakeRows = await dispatch('eos/getTableRows', {
    scope: accountName,
    code: process.env.ISCOIN_CONTRACT,
    table: 'stakes',
    limit: 500,
  }, { root: true });

  const stakes = [];
  stakeRows.forEach((stakeRow) => {
    const quantityAsset = stakeRow.quantity.split(' ');
    if (quantityAsset[1] !== process.env.CURRENCY_SYMBOL) {
      return;
    }
    stakes.push({
      quantity: parseFloat(quantityAsset[0]),
      start: stakeRow.start,
      durationIndex: stakeRow.duration_index,
    });
  });
  return stakes;
}

const storeState = {
  balance: null,
  stakes: [],
};

const storeMutations = {
  setBalance(state, balance) {
    state.balance = balance;
  },
  setStakes(state, stakes) {
    state.stakes = stakes;
  },
};

const storeActions = {
  async getIscoinData({
    commit, dispatch, rootGetters,
  }) {
    const accountName = rootGetters['eos/accountName'];
    commit('setBalance', await getBalance(dispatch, accountName));
    commit('setStakes', await getStakes(dispatch, accountName));
  },
  async addStake({ dispatch, rootGetters }, { quantity, durationIndex }) {
    const quantityFloat = parseFloat(quantity);
    const quantityString = `${quantityFloat.toFixed(process.env.CURRENCY_DECIMAL_PLACES)} ${process.env.CURRENCY_SYMBOL}`;
    const accountName = rootGetters['eos/accountName'];
    await dispatch('eos/transact', {
      account: process.env.ISCOIN_CONTRACT,
      name: 'addstake',
      auth: accountName,
      data: {
        staker: accountName,
        quantity: quantityString,
        duration_index: durationIndex,
      },
    }, { root: true });
  },
};

const storeGetters = {};

export default {
  namespaced: true,
  state: storeState,
  actions: storeActions,
  mutations: storeMutations,
  getters: storeGetters,
};
