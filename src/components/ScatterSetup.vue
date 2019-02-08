<!--
Copyright (c) 2018 inSpace Technologies Ltd
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->
<template>
  <div class="central">
    <div class="card">
      <div class="card-header">
        <span class="card-title">
          Using scatter
        </span>
      </div>
      <div class="card-content">
        <template v-if="!this.$store.state.scatter.scatter">
          <p>
            Scatter was not detected. You can get it from
            <a
              target="_blank"
              href="https://get-scatter.com/"
            >
              here.
            </a>
          </p> <!-- eslint-disable-line vue/max-attributes-per-line -->
          <button
            class="primary"
            @click="refresh"
          >
            Try again
          </button>
        </template>
        <template v-else-if="!this.$store.state.scatter.identitySet">
          <p>Scatter detected. You must now set your identity. Please click 'Set identity' when you are ready to do so.</p>
          <p>If you need to add the temporary inSpace EOS testnet network details to Scatter, you can do that too.</p>
          <div class="card-footer">
            <button
              class="primary"
              @click="requestIdentity"
            >
              Set identity
            </button>
            <button
              @click="addNetwork"
            >
              Add network
            </button>
          </div>
        </template>
        <template v-else>
          <p>Your identity has been set using Scatter.</p>
          <p><strong>Account name</strong>: {{ this.$store.getters['scatter/accountName'] }}</p>
          <button
            class="primary"
            @click="forgetIdentity"
          >
            Forget identity
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
<style scoped>
.help {
  vertical-align: super;
  font-size: 80%;
}
</style>
<script>
import logger from '../logger';

export default {
  computed: {
    identitySet() {
      if (this.$store.state.scatter.identitySet) {
        return true;
      }
      return false;
    },
  },
  watch: {
    identitySet(newValue) {
      if (newValue) {
        this.$emit('identity-set');
      }
    },
  },
  methods: {
    refresh() {
      window.location.reload(false);
    },
    async addNetwork() {
      try {
        const added = await this.$store.dispatch('scatter/suggestNetwork');
        if (added) {
          logger.notify({
            title: 'Success',
            text: 'Network successfully added to Scatter.',
            type: 'success',
            permanent: false,
            sticky: false,
            buttons: null,
          });
        }
      } catch (err) {
        logger.notify({
          title: err.code,
          text: err.message,
          type: 'error',
          permanent: false,
          sticky: true,
          buttons: null,
        });
      }
    },
    requestIdentity() {
      this.$store.dispatch('scatter/requestIdentity').then(() => {
      }, (err) => {
        logger.notify({
          title: err.code,
          text: err.message,
          type: 'error',
          permanent: false,
          sticky: true,
          buttons: null,
        });
      });
    },
    forgetIdentity() {
      this.$store.dispatch('scatter/forgetIdentity').then(() => {
      }, (err) => {
        logger.notify({
          title: err.code,
          text: err.message,
          type: 'error',
          permanent: false,
          sticky: true,
          buttons: null,
        });
      });
    },
  },
};
</script>
