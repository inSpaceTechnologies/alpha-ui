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
          Welcome
        </span>
      </div>
      <div class="card-content">
        <p>Welcome to inSpace!</p>
        <p v-if="!this.$store.getters['eos/identitySet']">
          If you have an EOS account, proceed to
          <router-link
            :to="{name: 'eos-setup'}"
            exact
            class="navbar-button"
          >
            EOS setup
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>
<script>
export default {
};
</script>
